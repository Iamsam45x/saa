import { NextRequest, NextResponse } from 'next/server';
import {
  createApiResponse,
  createApiError,
  enforceRateLimit,
  handleZodError,
  requireAuth,
  validateBody,
  writeAuditLog,
} from '@/lib/api-utils';
import { AISettingsSchema, GenerateSchemaSchema } from '@/lib/schemas';
import { toGenerationInput } from '@/lib/db-mappers';
import { generateSolutionSchema } from '@/lib/ai/client';
import { buildSchemaPrompt } from '@/lib/ai/client';
import { persistGeneratedSchema } from '@/lib/ai/persistence';
import { validateSolutionSchema } from '@/lib/solution-schema';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'ai:generate-schema', 10);
    if (limited) return limited;

    const body = await request.json();
    const data = toGenerationInput(validateBody(GenerateSchemaSchema, body));

    if (data.projectId) {
      const { data: project } = await auth.supabase
        .from('projects')
        .select('id')
        .eq('id', data.projectId)
        .eq('user_id', auth.userId)
        .maybeSingle();

      if (!project) {
        return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
      }
    }

    const { data: settingsRow } = await auth.supabase
      .from('ai_settings')
      .select('*')
      .eq('user_id', auth.userId)
      .maybeSingle();

    const settings = AISettingsSchema.parse(
      settingsRow
        ? {
            provider: settingsRow.provider,
            model: settingsRow.model,
            maxTokens: settingsRow.max_tokens,
            temperature: settingsRow.temperature,
            promptConfiguration: settingsRow.prompt_configuration,
          }
        : {},
    );

    const generation = await generateSolutionSchema(data, {
      model: settings.model,
      maxOutputTokens: settings.maxTokens,
      temperature: settings.temperature,
    });
    const validation = validateSolutionSchema(generation.schema);

    if (!validation.success) {
      return createApiError(
        {
          code: 'SCHEMA_VALIDATION_ERROR',
          message: 'Generated schema failed validation',
          details: validation.error.flatten(),
        },
        422,
      );
    }

    const prompt = buildSchemaPrompt(data);
    let persisted: Record<string, unknown> | null = null;
    try {
      persisted = await persistGeneratedSchema({
        supabase: auth.supabase,
        userId: auth.userId,
        projectId: data.projectId || null,
        schema: validation.data,
        variation: data.variation,
        prompt: {
          system: settings.promptConfiguration.systemPrompt || prompt.system,
          input: prompt.prompt,
          model: settings.model,
        },
        tokenUsage: generation.tokenUsage,
        processingTimeMs: generation.processingTimeMs,
        provider: generation.provider,
        fallbackReason: generation.fallbackReason,
        operation: 'generate_schema',
        model: generation.model,
        requestPayload: {
          projectId: data.projectId || null,
          applicationType: data.applicationType,
          features: data.features,
          theme: data.theme,
          variation: data.variation,
        },
      });
    } catch {
      console.warn('Schema persistence failed, returning schema without DB storage');
    }

    try {
      await writeAuditLog(auth.supabase, request, {
        userId: auth.userId,
        projectId: data.projectId || null,
        entityId: persisted?.id as string | undefined,
        entityType: 'generated_schema',
        action: 'ai.schema_generated',
        metadata: {
          provider: generation.provider,
          fallbackReason: generation.fallbackReason,
          variation: data.variation,
        },
      });
    } catch {
      console.warn('Audit log write failed, continuing');
    }

    return createApiResponse(
      persisted || {
        id: crypto.randomUUID(),
        projectId: null,
        version: 1,
        schema: validation.data,
        tokenUsage: generation.tokenUsage,
        processingTimeMs: generation.processingTimeMs,
        variation: data.variation,
        provider: generation.provider,
        fallbackReason: generation.fallbackReason,
        storage: 'none',
        createdAt: new Date().toISOString(),
      },
      201,
    );
  } catch (err) {
    return handleZodError(err);
  }
}

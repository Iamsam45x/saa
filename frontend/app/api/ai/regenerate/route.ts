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
import { AISettingsSchema, RegenerateSchema } from '@/lib/schemas';
import { generateSolutionSchema } from '@/lib/ai/client';
import { persistGeneratedSchema } from '@/lib/ai/persistence';
import { toGenerationInput } from '@/lib/db-mappers';
import { validateSolutionSchema } from '@/lib/solution-schema';

const VARIATION_TEMPERATURES: Record<string, number> = {
  layout: 0.5,
  modern: 0.7,
  conservative: 0.3,
};

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'ai:regenerate-schema', 10);
    if (limited) return limited;

    const body = await request.json();
    const data = validateBody(RegenerateSchema, body);

    const { data: project, error: projectError } = await auth.supabase
      .from('projects')
      .select('*')
      .eq('id', data.projectId)
      .eq('user_id', auth.userId)
      .single();

    if (projectError || !project) {
      return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
    }

    const { data: previousSchema, error: prevError } = await auth.supabase
      .from('generated_schemas')
      .select('id, schema')
      .eq('id', data.schemaId)
      .eq('project_id', data.projectId)
      .eq('user_id', auth.userId)
      .single();

    if (prevError || !previousSchema) {
      return createApiError({ code: 'NOT_FOUND', message: 'Previous schema not found' }, 404);
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

    const input = toGenerationInput({
      projectId: data.projectId,
      name: project.name,
      description: data.feedback
        ? `${project.description}\nRegeneration feedback: ${data.feedback}`
        : project.description,
      targetAudience: project.target_audience,
      location: project.location || '',
      applicationType: project.application_type,
      features: Array.isArray(project.features) ? project.features : [],
      theme: project.theme,
      customColors: project.custom_colors || undefined,
      variation: data.variation,
    });

    const generation = await generateSolutionSchema(input, {
      model: settings.model,
      maxOutputTokens: settings.maxTokens,
      temperature: VARIATION_TEMPERATURES[data.variation] ?? settings.temperature,
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

    const persisted = await persistGeneratedSchema({
      supabase: auth.supabase,
      userId: auth.userId,
      projectId: data.projectId,
      schema: validation.data,
      variation: data.variation,
      prompt: {
        previousSchemaId: previousSchema.id,
        feedback: data.feedback || null,
        variation: data.variation,
      },
      tokenUsage: generation.tokenUsage,
      processingTimeMs: generation.processingTimeMs,
      provider: generation.provider,
      fallbackReason: generation.fallbackReason,
      operation: 'regenerate_schema',
      model: generation.model,
      requestPayload: {
        projectId: data.projectId,
        schemaId: data.schemaId,
        variation: data.variation,
      },
      parentSchemaId: data.schemaId,
    });

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      projectId: data.projectId,
      entityId: persisted.id,
      entityType: 'generated_schema',
      action: 'ai.schema_regenerated',
      metadata: {
        previousSchemaId: previousSchema.id,
        variation: data.variation,
        fallbackReason: generation.fallbackReason,
      },
    });

    return createApiResponse(persisted, 201);
  } catch (err) {
    return handleZodError(err);
  }
}

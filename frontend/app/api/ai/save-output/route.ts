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
import { SaveGeneratedSchemaSchema } from '@/lib/schemas';
import { persistGeneratedSchema } from '@/lib/ai/persistence';
import { validateSolutionSchema } from '@/lib/solution-schema';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'ai:save-output', 30);
    if (limited) return limited;

    const body = await request.json();
    const data = validateBody(SaveGeneratedSchemaSchema, body);

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

    const validation = validateSolutionSchema(data.schema);
    if (!validation.success) {
      return createApiError(
        {
          code: 'SCHEMA_VALIDATION_ERROR',
          message: 'Saved output must match the solution schema contract',
          details: validation.error.flatten(),
        },
        422,
      );
    }

    const persisted = await persistGeneratedSchema({
      supabase: auth.supabase,
      userId: auth.userId,
      projectId: data.projectId || null,
      schema: validation.data,
      variation: data.variation,
      prompt: data.prompt || {},
      tokenUsage: data.tokenUsage,
      processingTimeMs: data.processingTimeMs,
      provider: 'local',
      fallbackReason: null,
      operation: 'save_output',
      requestPayload: { source: 'save_output' },
    });

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      projectId: data.projectId || null,
      entityId: persisted.id,
      entityType: 'generated_schema',
      action: 'ai.schema_saved',
    });

    return createApiResponse(persisted, 201);
  } catch (err) {
    return handleZodError(err);
  }
}

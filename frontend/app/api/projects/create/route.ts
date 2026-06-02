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
import { CreateProjectSchema } from '@/lib/schemas';
import { toProjectInsert, toProjectResponse } from '@/lib/db-mappers';
import { persistGeneratedSchema } from '@/lib/ai/persistence';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'projects:create', 30);
    if (limited) return limited;

    const body = await request.json();
    const data = validateBody(CreateProjectSchema, body);

    const { data: project, error } = await auth.supabase
      .from('projects')
      .insert(toProjectInsert(data, auth.userId))
      .select()
      .single();

    if (error || !project) {
      return createApiError(
        { code: 'DB_INSERT_ERROR', message: error?.message || 'Save failed' },
        500,
      );
    }

    let schemaId: string | null = null;
    if (data.schema) {
      const persisted = await persistGeneratedSchema({
        supabase: auth.supabase,
        userId: auth.userId,
        projectId: project.id,
        schema: data.schema,
        variation: 'layout',
        prompt: {
          name: data.name,
          applicationType: data.applicationType,
          features: data.features,
          theme: data.theme,
        },
        tokenUsage: { input: 0, output: 0, total: 0 },
        processingTimeMs: 0,
        provider: 'local',
        fallbackReason: null,
        operation: 'save_output',
        requestPayload: { source: 'project_create' },
      });
      schemaId = persisted.id;
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      projectId: project.id,
      entityId: project.id,
      entityType: 'project',
      action: 'project.created',
      metadata: { schemaId },
    });

    return createApiResponse({ ...toProjectResponse(project), latestSchemaId: schemaId }, 201);
  } catch (err) {
    return handleZodError(err);
  }
}

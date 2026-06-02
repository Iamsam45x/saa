import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createApiResponse,
  createApiError,
  enforceRateLimit,
  handleZodError,
  requireAuth,
  validateBody,
  writeAuditLog,
} from '@/lib/api-utils';
import { UpdateProjectSchema } from '@/lib/schemas';
import { toProjectResponse, toProjectUpdate } from '@/lib/db-mappers';
import { persistGeneratedSchema } from '@/lib/ai/persistence';

const ProjectIdSchema = z.string().uuid();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'projects:get', 120);
    if (limited) return limited;

    const id = ProjectIdSchema.parse(params.id);
    const { data: project, error } = await auth.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.userId)
      .single();

    if (error || !project) {
      return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
    }

    const { data: schemas } = await auth.supabase
      .from('generated_schemas')
      .select('id, version, variation, created_at')
      .eq('project_id', id)
      .eq('user_id', auth.userId)
      .order('version', { ascending: false });

    return createApiResponse({ ...toProjectResponse(project), versions: schemas || [] });
  } catch (err) {
    return handleZodError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'projects:update', 60);
    if (limited) return limited;

    const id = ProjectIdSchema.parse(params.id);
    const body = await request.json();
    const data = validateBody(UpdateProjectSchema, body);

    const { data: project, error } = await auth.supabase
      .from('projects')
      .update(toProjectUpdate(data))
      .eq('id', id)
      .eq('user_id', auth.userId)
      .select()
      .single();

    if (error || !project) {
      return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
    }

    let schemaId = project.latest_schema_id || null;
    if (data.schema) {
      const persisted = await persistGeneratedSchema({
        supabase: auth.supabase,
        userId: auth.userId,
        projectId: id,
        schema: data.schema,
        variation: 'layout',
        prompt: { source: 'project_update' },
        tokenUsage: { input: 0, output: 0, total: 0 },
        processingTimeMs: 0,
        provider: 'local',
        fallbackReason: null,
        operation: 'save_output',
        requestPayload: { source: 'project_update' },
      });
      schemaId = persisted.id;
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      projectId: id,
      entityId: id,
      entityType: 'project',
      action: 'project.updated',
      metadata: { schemaId },
    });

    return createApiResponse({ ...toProjectResponse(project), latestSchemaId: schemaId });
  } catch (err) {
    return handleZodError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'projects:delete', 30);
    if (limited) return limited;

    const id = ProjectIdSchema.parse(params.id);
    const { error } = await auth.supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.userId);

    if (error) {
      return createApiError({ code: 'DELETE_ERROR', message: error.message }, 500);
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      projectId: id,
      entityId: id,
      entityType: 'project',
      action: 'project.deleted',
    });

    return createApiResponse({ success: true });
  } catch (err) {
    return handleZodError(err);
  }
}

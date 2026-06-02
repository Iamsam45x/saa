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
import { CloneTemplateSchema } from '@/lib/schemas';
import { toProjectResponse, toTemplateResponse } from '@/lib/db-mappers';

const TemplateIdSchema = z.string().uuid();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'templates:clone', 30);
    if (limited) return limited;

    const id = TemplateIdSchema.parse(params.id);
    const body = await request.json().catch(() => ({}));
    const data = validateBody(CloneTemplateSchema, body);

    const { data: template, error } = await auth.supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !template) {
      return createApiError({ code: 'NOT_FOUND', message: 'Template not found' }, 404);
    }

    if (data.createProject) {
      const { data: project, error: projectError } = await auth.supabase
        .from('projects')
        .insert({
          user_id: auth.userId,
          name: data.name || `${template.name} Project`,
          description: template.description,
          target_audience: '',
          location: '',
          application_type: template.type,
          features: template.features || [],
          theme: template.theme || 'corporate-blue',
          custom_colors: template.custom_colors || null,
          status: 'Draft',
        })
        .select()
        .single();

      if (projectError || !project) {
        return createApiError(
          { code: 'DB_INSERT_ERROR', message: projectError?.message || 'Clone failed' },
          500,
        );
      }

      await writeAuditLog(auth.supabase, request, {
        userId: auth.userId,
        projectId: project.id,
        entityId: project.id,
        entityType: 'project',
        action: 'template.cloned_to_project',
        metadata: { templateId: id },
      });

      return createApiResponse({ project: toProjectResponse(project) }, 201);
    }

    const { data: clone, error: cloneError } = await auth.supabase
      .from('templates')
      .insert({
        user_id: auth.userId,
        source_project_id: template.source_project_id || null,
        name: data.name || `${template.name} Copy`,
        description: template.description,
        type: template.type,
        features: template.features || [],
        theme: template.theme || 'corporate-blue',
        custom_colors: template.custom_colors || null,
        schema: template.schema || null,
        is_public: false,
      })
      .select()
      .single();

    if (cloneError || !clone) {
      return createApiError(
        { code: 'DB_INSERT_ERROR', message: cloneError?.message || 'Clone failed' },
        500,
      );
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      entityId: clone.id,
      entityType: 'template',
      action: 'template.cloned',
      metadata: { templateId: id },
    });

    return createApiResponse(toTemplateResponse(clone), 201);
  } catch (err) {
    return handleZodError(err);
  }
}

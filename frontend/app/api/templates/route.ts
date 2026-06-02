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
import { CreateTemplateSchema } from '@/lib/schemas';
import { toTemplateInsert, toTemplateResponse } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'templates:list', 120);
    if (limited) return limited;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1), 100);

    let query = auth.supabase
      .from('templates')
      .select('*', { count: 'exact' })
      .order('popularity', { ascending: false })
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data: templates, error, count } = await query.range(from, to);

    if (error) {
      return createApiError({ code: 'DB_QUERY_ERROR', message: error.message }, 500);
    }

    return createApiResponse({
      templates: (templates || []).map(toTemplateResponse),
      total: count || 0,
    });
  } catch (err) {
    return handleZodError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'templates:create', 30);
    if (limited) return limited;

    const body = await request.json();
    const data = validateBody(CreateTemplateSchema, body);

    if (data.sourceProjectId) {
      const { data: sourceProject } = await auth.supabase
        .from('projects')
        .select('id')
        .eq('id', data.sourceProjectId)
        .eq('user_id', auth.userId)
        .maybeSingle();

      if (!sourceProject) {
        return createApiError({ code: 'NOT_FOUND', message: 'Source project not found' }, 404);
      }
    }

    const { data: template, error } = await auth.supabase
      .from('templates')
      .insert(toTemplateInsert(data, auth.userId))
      .select()
      .single();

    if (error || !template) {
      return createApiError(
        { code: 'DB_INSERT_ERROR', message: error?.message || 'Save failed' },
        500,
      );
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      entityId: template.id,
      entityType: 'template',
      action: 'template.created',
      projectId: data.sourceProjectId || null,
    });

    return createApiResponse(toTemplateResponse(template), 201);
  } catch (err) {
    return handleZodError(err);
  }
}

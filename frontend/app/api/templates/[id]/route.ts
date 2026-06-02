import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createApiResponse,
  createApiError,
  enforceRateLimit,
  handleZodError,
  requireAuth,
  writeAuditLog,
} from '@/lib/api-utils';
import { toTemplateResponse } from '@/lib/db-mappers';

const TemplateIdSchema = z.string().uuid();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'templates:get', 120);
    if (limited) return limited;

    const id = TemplateIdSchema.parse(params.id);
    const { data: template, error } = await auth.supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !template) {
      return createApiError({ code: 'NOT_FOUND', message: 'Template not found' }, 404);
    }

    await auth.supabase
      .from('templates')
      .update({ popularity: (template.popularity || 0) + 1 })
      .eq('id', id);

    return createApiResponse(toTemplateResponse(template));
  } catch (err) {
    return handleZodError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'templates:delete', 30);
    if (limited) return limited;

    const id = TemplateIdSchema.parse(params.id);
    const { error } = await auth.supabase
      .from('templates')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.userId);

    if (error) {
      return createApiError({ code: 'DELETE_ERROR', message: error.message }, 500);
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      entityId: id,
      entityType: 'template',
      action: 'template.deleted',
    });

    return createApiResponse({ success: true });
  } catch (err) {
    return handleZodError(err);
  }
}

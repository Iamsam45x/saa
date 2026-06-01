import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { UpdateProjectSchema } from '@/lib/schemas';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const { id } = await params;
    const supabase = getSupabaseClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !project) {
      return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
    }

    return createApiResponse(project);
  } catch (err) {
    return handleZodError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const { id } = await params;
    const body = await request.json();
    const data = validateBody(UpdateProjectSchema, body);

    const supabase = getSupabaseClient();
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !project) {
      return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
    }

    return createApiResponse(project);
  } catch (err) {
    return handleZodError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const { id } = await params;
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('projects').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      return createApiError({ code: 'DELETE_ERROR', message: error.message }, 500);
    }

    return createApiResponse({ success: true });
  } catch (err) {
    return handleZodError(err);
  }
}

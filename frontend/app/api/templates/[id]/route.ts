import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const { id } = await params;
    const supabase = getSupabaseClient();

    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !template) {
      return createApiError({ code: 'NOT_FOUND', message: 'Template not found' }, 404);
    }

    return createApiResponse(template);
  } catch (err) {
    return createApiError({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, 500);
  }
}

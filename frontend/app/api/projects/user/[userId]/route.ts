import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const authUserId = getAuthUserId(request);
    if (!authUserId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const { userId } = await params;

    if (authUserId !== userId) {
      return createApiError(
        { code: 'FORBIDDEN', message: "Cannot access another user's projects" },
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const sortBy = searchParams.get('sortBy') || 'updated_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');

    const supabase = getSupabaseClient();

    let query = supabase.from('projects').select('*', { count: 'exact' }).eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data: projects,
      error,
      count,
    } = await query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    if (error) {
      return createApiError({ code: 'DB_QUERY_ERROR', message: error.message }, 500);
    }

    return createApiResponse({
      projects: projects || [],
      total: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    return createApiError({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, 500);
  }
}

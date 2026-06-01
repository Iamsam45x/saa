import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    const supabase = getSupabaseClient();

    let query = supabase
      .from('templates')
      .select('*', { count: 'exact' })
      .order('popularity', { ascending: false });

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
      templates: templates || [],
      total: count || 0,
    });
  } catch (err) {
    return createApiError({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, 500);
  }
}

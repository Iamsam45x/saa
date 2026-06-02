import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse, createApiError, enforceRateLimit, requireAuth } from '@/lib/api-utils';
import { toProjectResponse } from '@/lib/db-mappers';
export { POST } from './create/route';

const SORT_COLUMNS = new Set(['created_at', 'updated_at', 'name', 'status', 'application_type']);

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const limited = enforceRateLimit(request, auth.userId, 'projects:list', 120);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1), 100);
  const requestedSortBy = searchParams.get('sortBy') || 'updated_at';
  const sortBy = SORT_COLUMNS.has(requestedSortBy) ? requestedSortBy : 'updated_at';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  const status = searchParams.get('status');

  let query = auth.supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', auth.userId);

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
    projects: (projects || []).map(toProjectResponse),
    total: count || 0,
    page,
    pageSize,
  });
}

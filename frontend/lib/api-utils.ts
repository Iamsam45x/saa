import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ZodError, type ZodSchema } from 'zod';
import { ApiErrorSchema } from '@/lib/schemas';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function createApiError(error: ApiError, status: number) {
  const body = ApiErrorSchema.parse({ error });
  return NextResponse.json(body, { status });
}

export function handleZodError(err: unknown) {
  if (err instanceof ZodError) {
    return createApiError(
      {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.flatten().fieldErrors,
      },
      400,
    );
  }
  return createApiError({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, 500);
}

export function validateBody<T>(schema: ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}

export function getAuthUserId(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.sub || payload.user_id || null;
  } catch {
    return null;
  }
}

export function requireAuth(request: Request): string | NextResponse {
  const userId = getAuthUserId(request);
  if (!userId) {
    return createApiError(
      { code: 'UNAUTHORIZED', message: 'Authentication required' },
      401,
    ) as NextResponse;
  }
  return userId;
}

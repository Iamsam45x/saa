import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { z, ZodError, type ZodTypeAny } from 'zod';
import { ApiErrorSchema } from '@/lib/schemas';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface AuthContext {
  user: User;
  userId: string;
  accessToken: string;
  supabase: SupabaseClient;
}

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const RATE_LIMITS = new Map<string, RateLimitBucket>();

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

  if (err instanceof Error) {
    return createApiError({ code: 'INTERNAL_ERROR', message: err.message }, 500);
  }

  return createApiError({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, 500);
}

export function validateBody<TSchema extends ZodTypeAny>(
  schema: TSchema,
  body: unknown,
): z.infer<TSchema> {
  return schema.parse(body);
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabaseClient(accessToken?: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  });
}

export function getOptionalSupabaseClient(accessToken?: string) {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseClient(accessToken);
}

export function getBearerToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}

export async function requireAuth(request: Request): Promise<AuthContext | NextResponse> {
  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
  }

  let supabase: SupabaseClient;
  try {
    supabase = getSupabaseClient(accessToken);
  } catch (err) {
    return createApiError(
      {
        code: 'CONFIGURATION_ERROR',
        message: err instanceof Error ? err.message : 'Supabase is not configured',
      },
      500,
    );
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return createApiError({ code: 'UNAUTHORIZED', message: 'Invalid authentication token' }, 401);
  }

  await supabase.from('users').upsert(
    {
      id: data.user.id,
      email: data.user.email || null,
      full_name:
        typeof data.user.user_metadata?.full_name === 'string'
          ? data.user.user_metadata.full_name
          : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  return {
    user: data.user,
    userId: data.user.id,
    accessToken,
    supabase,
  };
}

export async function getAuthUserId(request: Request): Promise<string | null> {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return null;
  return auth.userId;
}

export function getClientIp(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function enforceRateLimit(
  request: Request,
  userId: string,
  scope: string,
  limit = 60,
  windowMs = 60_000,
) {
  const now = Date.now();
  const key = `${scope}:${userId}:${getClientIp(request)}`;
  const bucket = RATE_LIMITS.get(key);

  if (!bucket || bucket.resetAt <= now) {
    RATE_LIMITS.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (bucket.count >= limit) {
    return createApiError(
      {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again shortly.',
        details: { resetAt: new Date(bucket.resetAt).toISOString() },
      },
      429,
    );
  }

  bucket.count += 1;
  return null;
}

export async function writeAuditLog(
  supabase: SupabaseClient,
  request: Request,
  input: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string | null;
    projectId?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from('audit_logs').insert({
    user_id: input.userId,
    project_id: input.projectId || null,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId || null,
    metadata: input.metadata || {},
    ip_address: getClientIp(request),
    user_agent: request.headers.get('user-agent') || null,
  });

  if (error && process.env.NODE_ENV !== 'production') {
    console.warn(`audit log failed: ${error.message}`);
  }
}

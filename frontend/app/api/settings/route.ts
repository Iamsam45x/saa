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
import { AISettingsSchema, UpdateAISettingsSchema } from '@/lib/schemas';

function toSettingsResponse(row: any) {
  return {
    provider: row.provider || 'anthropic',
    model: row.model || 'claude-sonnet-4-20250514',
    maxTokens: row.max_tokens || 4096,
    temperature: row.temperature ?? 0.3,
    promptConfiguration: row.prompt_configuration || { enforceRegistry: true },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'settings:get', 120);
    if (limited) return limited;

    const { data: settings, error } = await auth.supabase
      .from('ai_settings')
      .select('*')
      .eq('user_id', auth.userId)
      .maybeSingle();

    if (error) {
      return createApiError({ code: 'DB_QUERY_ERROR', message: error.message }, 500);
    }

    if (settings) {
      return createApiResponse(toSettingsResponse(settings));
    }

    const defaults = AISettingsSchema.parse({});
    return createApiResponse(defaults);
  } catch (err) {
    return handleZodError(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const limited = enforceRateLimit(request, auth.userId, 'settings:update', 30);
    if (limited) return limited;

    const body = await request.json();
    const data = validateBody(UpdateAISettingsSchema, body);
    const defaults = AISettingsSchema.parse({});
    const merged = { ...defaults, ...data };

    const { data: settings, error } = await auth.supabase
      .from('ai_settings')
      .upsert(
        {
          user_id: auth.userId,
          provider: merged.provider,
          model: merged.model,
          max_tokens: merged.maxTokens,
          temperature: merged.temperature,
          prompt_configuration: merged.promptConfiguration,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      .select()
      .single();

    if (error || !settings) {
      return createApiError(
        { code: 'DB_UPDATE_ERROR', message: error?.message || 'Update failed' },
        500,
      );
    }

    await writeAuditLog(auth.supabase, request, {
      userId: auth.userId,
      entityId: auth.userId,
      entityType: 'ai_settings',
      action: 'settings.updated',
      metadata: { model: merged.model },
    });

    return createApiResponse(toSettingsResponse(settings));
  } catch (err) {
    return handleZodError(err);
  }
}

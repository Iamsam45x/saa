import type { SupabaseClient } from '@supabase/supabase-js';
import { toGeneratedSchemaResponse } from '@/lib/db-mappers';

type TokenUsage = {
  input: number;
  output: number;
  total: number;
};

interface PersistGeneratedSchemaInput {
  supabase: SupabaseClient;
  userId: string;
  projectId?: string | null;
  schema: Record<string, unknown>;
  variation: string;
  prompt?: Record<string, unknown>;
  tokenUsage: TokenUsage;
  processingTimeMs: number;
  provider: 'anthropic' | 'local';
  fallbackReason: string | null;
  operation: 'generate_schema' | 'regenerate_schema' | 'save_output';
  model?: string;
  requestPayload?: Record<string, unknown>;
  parentSchemaId?: string | null;
}

async function nextVersion(supabase: SupabaseClient, userId: string, projectId?: string | null) {
  let query = supabase
    .from('generated_schemas')
    .select('version')
    .eq('user_id', userId)
    .order('version', { ascending: false })
    .limit(1);

  query = projectId ? query.eq('project_id', projectId) : query.is('project_id', null);

  const { data } = await query.maybeSingle();
  return (data?.version || 0) + 1;
}

export async function persistGeneratedSchema(input: PersistGeneratedSchemaInput) {
  const version = await nextVersion(input.supabase, input.userId, input.projectId);
  const schema = input.schema as any;

  const { data: generatedSchema, error: schemaError } = await input.supabase
    .from('generated_schemas')
    .insert({
      project_id: input.projectId || null,
      user_id: input.userId,
      version,
      schema: input.schema,
      pages: Array.isArray(schema.pages) ? schema.pages : [],
      features: Array.isArray(schema.recommended_features)
        ? schema.recommended_features
        : Array.isArray(schema.features)
          ? schema.features
          : [],
      theme_configuration: schema.theme || {},
      variation: input.variation,
      prompt: input.prompt || {},
      token_usage: input.tokenUsage,
      processing_time_ms: input.processingTimeMs,
      provider: input.provider,
      fallback_reason: input.fallbackReason,
      parent_schema_id: input.parentSchemaId || null,
    })
    .select()
    .single();

  if (schemaError || !generatedSchema) {
    throw new Error(schemaError?.message || 'Failed to persist generated schema');
  }

  if (input.projectId) {
    await input.supabase.from('project_versions').insert({
      project_id: input.projectId,
      user_id: input.userId,
      generated_schema_id: generatedSchema.id,
      version,
      schema: input.schema,
      prompt: input.prompt || {},
      token_usage: input.tokenUsage,
      processing_time_ms: input.processingTimeMs,
      provider: input.provider,
      fallback_reason: input.fallbackReason,
    });

    await input.supabase
      .from('projects')
      .update({
        latest_schema_id: generatedSchema.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.projectId)
      .eq('user_id', input.userId);
  }

  await input.supabase.from('ai_generations').insert({
    user_id: input.userId,
    project_id: input.projectId || null,
    generated_schema_id: generatedSchema.id,
    operation: input.operation,
    provider: input.provider,
    model: input.model || null,
    prompt_config: input.prompt || {},
    request_payload: input.requestPayload || {},
    response_payload: { schemaId: generatedSchema.id, version },
    token_usage: input.tokenUsage,
    status: 'succeeded',
    error_message: input.fallbackReason,
    processing_time_ms: input.processingTimeMs,
  });

  return toGeneratedSchemaResponse(generatedSchema, {
    provider: input.provider,
    fallbackReason: input.fallbackReason,
  });
}

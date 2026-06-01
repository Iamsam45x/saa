import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { GenerateSchemaSchema } from '@/lib/schemas';
import { AIClient, buildSchemaPrompt } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const data = validateBody(GenerateSchemaSchema, body);

    const ai = new AIClient();
    const { prompt, system } = buildSchemaPrompt(data);

    const startTime = Date.now();
    const result = await ai.generateWithRetry(prompt, system);
    const processingTimeMs = Date.now() - startTime;

    let schema: Record<string, unknown>;
    try {
      schema = JSON.parse(result.content);
    } catch {
      return createApiError(
        { code: 'AI_PARSE_ERROR', message: 'Failed to parse AI response as JSON' },
        502,
      );
    }

    const supabase = getSupabaseClient();
    const { data: schemaRecord, error: dbError } = await supabase
      .from('schemas')
      .insert({
        project_id: data.projectId || null,
        schema,
        token_usage: {
          input: result.inputTokens,
          output: result.outputTokens,
          total: result.inputTokens + result.outputTokens,
        },
        processing_time_ms: processingTimeMs,
        variation: data.variation || 'layout',
        user_id: userId,
      })
      .select()
      .single();

    if (dbError) {
      return createApiError({ code: 'DB_INSERT_ERROR', message: dbError.message }, 500);
    }

    return createApiResponse(schemaRecord, 201);
  } catch (err) {
    return handleZodError(err);
  }
}

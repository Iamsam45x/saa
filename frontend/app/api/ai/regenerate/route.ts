import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { RegenerateSchema } from '@/lib/schemas';
import { AIClient } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const data = validateBody(RegenerateSchema, body);

    const supabase = getSupabaseClient();
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', data.projectId)
      .eq('user_id', userId)
      .single();

    if (projectError || !project) {
      return createApiError({ code: 'NOT_FOUND', message: 'Project not found' }, 404);
    }

    const { data: previousSchema, error: prevError } = await supabase
      .from('schemas')
      .select('schema')
      .eq('id', data.schemaId)
      .single();

    if (prevError) {
      return createApiError({ code: 'NOT_FOUND', message: 'Previous schema not found' }, 404);
    }

    const variationHints: Record<string, string> = {
      layout: 'Completely restructure the layout while keeping the same features.',
      modern: 'Apply modern design patterns, glassmorphism, rounded corners, and bold typography.',
      conservative: 'Use a clean, traditional layout with minimal visual complexity.',
    };

    const hint = variationHints[data.variation] || variationHints.layout;
    const feedbackLine = data.feedback ? `\nAdditional feedback: ${data.feedback}` : '';

    const system =
      'You are an expert UI/UX architect. Generate a variation of a UI schema. ' +
      'Output ONLY valid JSON with no markdown formatting.';

    const prompt = `Regenerate the following UI schema with a variation.

  Variation: ${data.variation}
  Hint: ${hint}${feedbackLine}

  Previous schema:
  ${JSON.stringify(previousSchema.schema, null, 2)}

  Return the complete regenerated JSON schema.`;

    const ai = new AIClient({ temperature: data.variation === 'modern' ? 0.7 : 0.3 });
    const startTime = Date.now();
    const result = await ai.generateWithRetry(prompt, system);
    const processingTimeMs = Date.now() - startTime;

    let regeneratedSchema: Record<string, unknown>;
    try {
      regeneratedSchema = JSON.parse(result.content);
    } catch {
      return createApiError(
        { code: 'AI_PARSE_ERROR', message: 'Failed to parse regenerated schema as JSON' },
        502,
      );
    }

    const { data: newSchema, error: dbError } = await supabase
      .from('schemas')
      .insert({
        project_id: data.projectId,
        schema: regeneratedSchema,
        token_usage: {
          input: result.inputTokens,
          output: result.outputTokens,
          total: result.inputTokens + result.outputTokens,
        },
        processing_time_ms: processingTimeMs,
        variation: data.variation,
        user_id: userId,
        parent_schema_id: data.schemaId,
      })
      .select()
      .single();

    if (dbError) {
      return createApiError({ code: 'DB_INSERT_ERROR', message: dbError.message }, 500);
    }

    return createApiResponse(newSchema, 201);
  } catch (err) {
    return handleZodError(err);
  }
}

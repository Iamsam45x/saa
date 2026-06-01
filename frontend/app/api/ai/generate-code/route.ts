import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { GenerateCodeSchema } from '@/lib/schemas';
import { AIClient } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const data = validateBody(GenerateCodeSchema, body);

    const supabase = getSupabaseClient();
    const { data: schemaRecord, error: schemaError } = await supabase
      .from('schemas')
      .select('schema')
      .eq('id', data.schemaId)
      .single();

    if (schemaError || !schemaRecord) {
      return createApiError({ code: 'NOT_FOUND', message: 'Schema not found' }, 404);
    }

    const system = `You are an expert ${data.framework} developer. Generate production-ready ${data.framework} code based on the provided UI schema. Output ONLY valid code with no explanation.`;

    const prompt = `Generate ${data.framework} code for the following UI schema:\n\n${JSON.stringify(schemaRecord.schema, null, 2)}\n\n${data.minify ? 'Minify the output.' : 'Format the output with proper indentation.'}`;

    const ai = new AIClient({ temperature: 0.1 });
    const result = await ai.generateWithRetry(prompt, system);

    return createApiResponse({
      code: result.content,
      framework: data.framework,
      tokenUsage: {
        input: result.inputTokens,
        output: result.outputTokens,
        total: result.inputTokens + result.outputTokens,
      },
    });
  } catch (err) {
    return handleZodError(err);
  }
}

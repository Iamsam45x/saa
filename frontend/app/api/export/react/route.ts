import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { ExportReactSchema } from '@/lib/schemas';
import { AIClient } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const data = validateBody(ExportReactSchema, body);

    const supabase = getSupabaseClient();
    const { data: schemaRecord, error: schemaError } = await supabase
      .from('schemas')
      .select('schema')
      .eq('id', data.schemaId)
      .single();

    if (schemaError || !schemaRecord) {
      return createApiError({ code: 'NOT_FOUND', message: 'Schema not found' }, 404);
    }

    const tsExt = data.options?.typescript !== false ? '.tsx' : '.jsx';
    const styling = data.options?.styling || 'tailwind';

    const system = `You are a React expert. Generate a complete, production-ready React ${styling} component based on the provided UI schema. Output ONLY the component code as a single file.`;

    const prompt = `Generate a React${data.options?.typescript ? ' TypeScript' : ''} component${tsExt} using ${styling} for styling${data.options?.includeTests ? ' with a basic test file' : ''}.

  Schema:
  ${JSON.stringify(schemaRecord.schema, null, 2)}

  Return the component code only.`;

    const ai = new AIClient({ temperature: 0.1 });
    const result = await ai.generateWithRetry(prompt, system);

    const fileName = `Component${tsExt}`;

    const { data: _storageData, error: storageError } = await supabase.storage
      .from('exports')
      .upload(`${userId}/${data.schemaId}/${fileName}`, result.content, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (storageError) {
      return createApiError({ code: 'STORAGE_ERROR', message: storageError.message }, 500);
    }

    const { data: urlData } = supabase.storage
      .from('exports')
      .getPublicUrl(`${userId}/${data.schemaId}/${fileName}`);

    return createApiResponse({
      url: urlData.publicUrl,
      fileName,
      size: new Blob([result.content]).size,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    return handleZodError(err);
  }
}

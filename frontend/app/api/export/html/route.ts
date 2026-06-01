import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { ExportHtmlSchema } from '@/lib/schemas';
import { AIClient } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const data = validateBody(ExportHtmlSchema, body);

    const supabase = getSupabaseClient();
    const { data: schemaRecord, error: schemaError } = await supabase
      .from('schemas')
      .select('schema')
      .eq('id', data.schemaId)
      .single();

    if (schemaError || !schemaRecord) {
      return createApiError({ code: 'NOT_FOUND', message: 'Schema not found' }, 404);
    }

    const inline = data.options?.inlineCss !== false;
    const responsive = data.options?.responsive !== false;

    const system =
      'You are an HTML/CSS expert. Generate a complete, self-contained HTML document based on the provided UI schema. Output ONLY the HTML code.';

    const prompt = `Generate a complete HTML document from this UI schema.
  ${inline ? 'Include all CSS inline within <style> tags.' : 'Use external CSS classes.'}
  ${responsive ? 'Make the design fully responsive.' : 'Use fixed-width layout.'}

  Schema:
  ${JSON.stringify(schemaRecord.schema, null, 2)}

  Return the complete HTML document.`;

    const ai = new AIClient({ temperature: 0.1 });
    const result = await ai.generateWithRetry(prompt, system);

    const fileName = 'index.html';

    const { data: _storageData, error: storageError } = await supabase.storage
      .from('exports')
      .upload(`${userId}/${data.schemaId}/${fileName}`, result.content, {
        contentType: 'text/html',
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

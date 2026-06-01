import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createApiError,
  handleZodError,
  validateBody,
  getSupabaseClient,
  getAuthUserId,
} from '@/lib/api-utils';
import { CreateProjectSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return createApiError({ code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const data = validateBody(CreateProjectSchema, body);

    const supabase = getSupabaseClient();
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name: data.name,
        description: data.description,
        target_audience: data.targetAudience,
        location: data.location || '',
        application_type: data.applicationType,
        features: data.features,
        theme: data.theme,
        custom_colors: data.customColors || null,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      return createApiError({ code: 'DB_INSERT_ERROR', message: error.message }, 500);
    }

    return createApiResponse(project, 201);
  } catch (err) {
    return handleZodError(err);
  }
}

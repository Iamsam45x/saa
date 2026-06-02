import type {
  CreateProjectInput,
  CreateTemplateInput,
  GenerateSchemaInput,
  UpdateProjectInput,
} from '@/lib/schemas';

type Row = Record<string, any>;

export function toProjectResponse(row: Row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    targetAudience: row.target_audience || '',
    location: row.location || '',
    applicationType: row.application_type,
    features: Array.isArray(row.features) ? row.features : [],
    theme: row.theme,
    customColors: row.custom_colors || undefined,
    status: row.status || 'Draft',
    userId: row.user_id,
    latestSchemaId: row.latest_schema_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProjectInsert(data: CreateProjectInput, userId: string) {
  return {
    user_id: userId,
    name: data.name,
    description: data.description,
    target_audience: data.targetAudience,
    location: data.location || '',
    application_type: data.applicationType,
    features: data.features,
    theme: data.theme,
    custom_colors: data.customColors || null,
    status: data.status || 'Draft',
  };
}

export function toProjectUpdate(data: UpdateProjectInput) {
  const payload: Row = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.targetAudience !== undefined) payload.target_audience = data.targetAudience;
  if (data.location !== undefined) payload.location = data.location || '';
  if (data.applicationType !== undefined) payload.application_type = data.applicationType;
  if (data.features !== undefined) payload.features = data.features;
  if (data.theme !== undefined) payload.theme = data.theme;
  if (data.customColors !== undefined) payload.custom_colors = data.customColors || null;
  if (data.status !== undefined) payload.status = data.status;
  payload.updated_at = new Date().toISOString();
  return payload;
}

export function toTemplateResponse(row: Row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type || row.application_type,
    features: Array.isArray(row.features) ? row.features : [],
    theme: row.theme || 'corporate-blue',
    customColors: row.custom_colors || undefined,
    schema: row.schema || undefined,
    popularity: row.popularity || 0,
    userId: row.user_id || null,
    isPublic: Boolean(row.is_public),
    sourceProjectId: row.source_project_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toTemplateInsert(data: CreateTemplateInput, userId: string) {
  return {
    user_id: userId,
    source_project_id: data.sourceProjectId || null,
    name: data.name,
    description: data.description,
    type: data.type,
    features: data.features,
    theme: data.theme,
    custom_colors: data.customColors || null,
    schema: data.schema || null,
    is_public: data.isPublic || false,
  };
}

export function toGenerationInput(data: GenerateSchemaInput): GenerateSchemaInput {
  return {
    ...data,
    location: data.location || '',
    variation: data.variation || 'layout',
  };
}

export function toGeneratedSchemaResponse(
  row: Row,
  options: {
    provider: 'anthropic' | 'local';
    fallbackReason: string | null;
    storage?: string;
  },
) {
  return {
    id: row.id,
    projectId: row.project_id || null,
    version: row.version || 1,
    schema: row.schema,
    tokenUsage: row.token_usage || { input: 0, output: 0, total: 0 },
    processingTimeMs: row.processing_time_ms || 0,
    variation: row.variation || 'layout',
    provider: options.provider,
    fallbackReason: options.fallbackReason,
    storage: options.storage || 'supabase',
    createdAt: row.created_at,
  };
}

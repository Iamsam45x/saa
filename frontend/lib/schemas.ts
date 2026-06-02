import { z } from 'zod';

export const ApplicationTypeEnum = z.enum(['Website', 'CRM', 'ERP', 'Mobile App', 'SaaS Platform']);

export const ThemeTypeEnum = z.enum([
  'corporate-blue',
  'dark-mode',
  'minimal-white',
  'neon-gradient',
  'custom-brand',
]);

export const FeatureSchema = z.string().min(1).max(100);

export const CustomColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const ProjectStatusEnum = z.enum(['Draft', 'In Progress', 'Completed']);

// ─── Project ──────────────────────────────────────────────────────────────────

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  targetAudience: z.string().min(1, 'Target audience is required').max(500),
  location: z.string().max(200).optional().default(''),
  applicationType: ApplicationTypeEnum,
  features: z.array(FeatureSchema).min(1, 'At least one feature is required'),
  theme: ThemeTypeEnum,
  customColors: CustomColorsSchema.optional(),
  schema: z.record(z.any()).optional(),
  status: ProjectStatusEnum.optional().default('Draft'),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  targetAudience: z.string(),
  location: z.string(),
  applicationType: ApplicationTypeEnum,
  features: z.array(z.string()),
  theme: ThemeTypeEnum,
  customColors: CustomColorsSchema.optional(),
  status: ProjectStatusEnum.optional(),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ProjectListResponseSchema = z.object({
  projects: z.array(ProjectResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

// ─── AI Generation ────────────────────────────────────────────────────────────

export const GenerateSchemaSchema = z.object({
  projectId: z.string().uuid().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  targetAudience: z.string().min(1),
  location: z.string().optional(),
  applicationType: ApplicationTypeEnum,
  features: z.array(FeatureSchema).min(1),
  theme: ThemeTypeEnum,
  customColors: CustomColorsSchema.optional(),
  variation: z.enum(['layout', 'modern', 'conservative']).optional().default('layout'),
});

export const GenerateCodeSchema = z.object({
  schemaId: z.string().uuid(),
  framework: z.enum(['react', 'nextjs', 'html']),
  minify: z.boolean().optional().default(false),
});

export const RegenerateSchema = z.object({
  projectId: z.string().uuid(),
  schemaId: z.string().uuid(),
  variation: z.enum(['layout', 'modern', 'conservative']),
  feedback: z.string().max(1000).optional(),
});

export const AISchemaResponseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid().nullable(),
  version: z.number().optional(),
  schema: z.record(z.any()),
  tokenUsage: z.object({
    input: z.number(),
    output: z.number(),
    total: z.number(),
  }),
  processingTimeMs: z.number(),
  variation: z.string().optional(),
  provider: z.enum(['anthropic', 'local']).optional(),
  fallbackReason: z.string().nullable().optional(),
  storage: z.string().optional(),
  createdAt: z.string().datetime(),
});

// ─── Templates ────────────────────────────────────────────────────────────────

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  type: ApplicationTypeEnum,
  features: z.array(z.string()),
  theme: ThemeTypeEnum,
  schema: z.record(z.any()).optional(),
  popularity: z.number().optional(),
  createdAt: z.string().datetime(),
});

export const TemplateListResponseSchema = z.object({
  templates: z.array(TemplateSchema),
  total: z.number(),
});

export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(200),
  description: z.string().min(1, 'Template description is required').max(1000),
  type: ApplicationTypeEnum,
  features: z.array(FeatureSchema).default([]),
  theme: ThemeTypeEnum.default('corporate-blue'),
  customColors: CustomColorsSchema.optional(),
  schema: z.record(z.any()).optional(),
  sourceProjectId: z.string().uuid().optional(),
  isPublic: z.boolean().optional().default(false),
});

export const CloneTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  createProject: z.boolean().optional().default(false),
});

// ─── Export ───────────────────────────────────────────────────────────────────

export const ExportReactSchema = z.object({
  projectId: z.string().uuid(),
  schemaId: z.string().uuid(),
  options: z
    .object({
      typescript: z.boolean().optional().default(true),
      styling: z
        .enum(['tailwind', 'css-modules', 'styled-components'])
        .optional()
        .default('tailwind'),
      includeTests: z.boolean().optional().default(false),
    })
    .optional(),
});

export const ExportHtmlSchema = z.object({
  projectId: z.string().uuid(),
  schemaId: z.string().uuid(),
  options: z
    .object({
      inlineCss: z.boolean().optional().default(true),
      responsive: z.boolean().optional().default(true),
    })
    .optional(),
});

export const ExportPdfSchema = z.object({
  projectId: z.string().uuid(),
  schemaId: z.string().uuid(),
  options: z
    .object({
      format: z.enum(['a4', 'letter']).optional().default('a4'),
      includeCode: z.boolean().optional().default(false),
    })
    .optional(),
});

export const ExportResponseSchema = z.object({
  url: z.string().url(),
  fileName: z.string(),
  size: z.number(),
  expiresAt: z.string().datetime(),
});

export const AISettingsSchema = z.object({
  provider: z.literal('anthropic').default('anthropic'),
  model: z.string().min(1).max(120).default('claude-sonnet-4-20250514'),
  maxTokens: z.number().int().min(512).max(8192).default(4096),
  temperature: z.number().min(0).max(1).default(0.3),
  promptConfiguration: z
    .object({
      systemPrompt: z.string().max(5000).optional(),
      schemaPromptPrefix: z.string().max(5000).optional(),
      enforceRegistry: z.boolean().optional().default(true),
    })
    .optional()
    .default({ enforceRegistry: true }),
});

export const UpdateAISettingsSchema = AISettingsSchema.partial();

export const SaveGeneratedSchemaSchema = z.object({
  projectId: z.string().uuid().optional(),
  schema: z.record(z.any()),
  variation: z.enum(['layout', 'modern', 'conservative']).optional().default('layout'),
  prompt: z.record(z.any()).optional(),
  tokenUsage: z
    .object({
      input: z.number().int().min(0),
      output: z.number().int().min(0),
      total: z.number().int().min(0),
    })
    .optional()
    .default({ input: 0, output: 0, total: 0 }),
  processingTimeMs: z.number().int().min(0).optional().default(0),
});

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ComponentRegistrySchema = z.object({
  components: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string(),
      props: z.record(z.any()),
      version: z.string(),
    }),
  ),
});

// ─── Errors ───────────────────────────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type GenerateSchemaInput = z.infer<typeof GenerateSchemaSchema>;
export type GenerateCodeInput = z.infer<typeof GenerateCodeSchema>;
export type RegenerateInput = z.infer<typeof RegenerateSchema>;
export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;
export type CloneTemplateInput = z.infer<typeof CloneTemplateSchema>;
export type ExportReactInput = z.infer<typeof ExportReactSchema>;
export type ExportHtmlInput = z.infer<typeof ExportHtmlSchema>;
export type ExportPdfInput = z.infer<typeof ExportPdfSchema>;
export type AISettingsInput = z.infer<typeof AISettingsSchema>;
export type UpdateAISettingsInput = z.infer<typeof UpdateAISettingsSchema>;
export type SaveGeneratedSchemaInput = z.infer<typeof SaveGeneratedSchemaSchema>;

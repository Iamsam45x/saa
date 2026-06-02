import { z } from 'zod';
import {
  COMPONENT_REGISTRY,
  REGISTRY_CATEGORIES,
  getDefaultVariant,
  isRegisteredVariant,
  type RegistryCategory,
} from '@/lib/component-registry';

export const ProjectTypeSchema = z.enum(['website', 'crm', 'erp', 'mobile_app', 'saas_platform']);

export const ThemePaletteSchema = z.enum([
  'corporate_blue',
  'dark_mode',
  'minimal_white',
  'neon_gradient',
  'custom_brand',
]);

export const SectionSchema = z
  .object({
    type: z.enum(REGISTRY_CATEGORIES as [RegistryCategory, ...RegistryCategory[]]),
    variant: z.string().min(1),
    title: z.string().min(1).max(120),
    intent: z.string().min(1).max(240),
    content: z.record(z.unknown()).default({}),
  })
  .superRefine((section, ctx) => {
    if (!isRegisteredVariant(section.type, section.variant)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['variant'],
        message: `Variant ${section.variant} is not registered for ${section.type}`,
      });
    }
  });

export const PageSchema = z.object({
  name: z.string().min(1).max(80),
  path: z.string().min(1).max(120),
  purpose: z.string().min(1).max(240),
  sections: z.array(SectionSchema).min(1).max(8),
});

export const SolutionSchema = z.object({
  project_type: ProjectTypeSchema,
  business: z.object({
    name: z.string().min(1).max(160),
    description: z.string().min(1).max(1200),
    target_users: z.string().min(1).max(400),
    location: z.string().max(160).default(''),
  }),
  theme: z.object({
    palette: ThemePaletteSchema,
    style: z.enum(['modern_saas', 'minimal', 'executive', 'high_contrast']),
    primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  summary: z.string().min(1).max(900),
  recommended_features: z.array(z.string().min(1).max(100)).min(1).max(24),
  modules: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        description: z.string().min(1).max(240),
        priority: z.enum(['must_have', 'should_have', 'future']),
      }),
    )
    .min(1)
    .max(12),
  pages: z.array(PageSchema).min(1).max(8),
  assumptions: z.array(z.string().min(1).max(180)).default([]),
  non_goals: z.array(z.string().min(1).max(180)).default([]),
  registry: z.object({
    version: z.string().min(1),
    allowed_components: z.record(z.array(z.string())),
  }),
});

export type SolutionSection = z.infer<typeof SectionSchema>;
export type SolutionPage = z.infer<typeof PageSchema>;
export type SolutionSchemaType = z.infer<typeof SolutionSchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type ThemePalette = z.infer<typeof ThemePaletteSchema>;

export const SOLUTION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'project_type',
    'business',
    'theme',
    'summary',
    'recommended_features',
    'modules',
    'pages',
    'assumptions',
    'non_goals',
    'registry',
  ],
  properties: {
    project_type: {
      type: 'string',
      enum: ['website', 'crm', 'erp', 'mobile_app', 'saas_platform'],
    },
    business: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'description', 'target_users', 'location'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        target_users: { type: 'string' },
        location: { type: 'string' },
      },
    },
    theme: {
      type: 'object',
      additionalProperties: false,
      required: ['palette', 'style', 'primary_color', 'secondary_color', 'accent_color'],
      properties: {
        palette: {
          type: 'string',
          enum: ['corporate_blue', 'dark_mode', 'minimal_white', 'neon_gradient', 'custom_brand'],
        },
        style: {
          type: 'string',
          enum: ['modern_saas', 'minimal', 'executive', 'high_contrast'],
        },
        primary_color: { type: 'string' },
        secondary_color: { type: 'string' },
        accent_color: { type: 'string' },
      },
    },
    summary: { type: 'string' },
    recommended_features: {
      type: 'array',
      items: { type: 'string' },
    },
    modules: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'description', 'priority'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['must_have', 'should_have', 'future'] },
        },
      },
    },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'path', 'purpose', 'sections'],
        properties: {
          name: { type: 'string' },
          path: { type: 'string' },
          purpose: { type: 'string' },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['type', 'variant', 'title', 'intent', 'content'],
              properties: {
                type: { type: 'string', enum: REGISTRY_CATEGORIES },
                variant: {
                  type: 'string',
                  enum: Object.values(COMPONENT_REGISTRY).flat(),
                },
                title: { type: 'string' },
                intent: { type: 'string' },
                content: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    assumptions: {
      type: 'array',
      items: { type: 'string' },
    },
    non_goals: {
      type: 'array',
      items: { type: 'string' },
    },
    registry: {
      type: 'object',
      additionalProperties: false,
      required: ['version', 'allowed_components'],
      properties: {
        version: { type: 'string' },
        allowed_components: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

export function validateSolutionSchema(schema: unknown) {
  return SolutionSchema.safeParse(schema);
}

export function normalizeVariant(category: RegistryCategory, variant?: string) {
  if (variant && isRegisteredVariant(category, variant)) return variant;
  return getDefaultVariant(category);
}

import type { GenerateSchemaInput } from '@/lib/schemas';
import { REGISTRY_FOR_PROMPT, type RegistryCategory } from '@/lib/component-registry';
import {
  normalizeVariant,
  type ProjectType,
  type SolutionPage,
  type SolutionSchemaType,
  type ThemePalette,
} from '@/lib/solution-schema';

type Priority = 'must_have' | 'should_have' | 'future';

const THEME_COLORS: Record<
  ThemePalette,
  {
    primary: string;
    secondary: string;
    accent: string;
    style: SolutionSchemaType['theme']['style'];
  }
> = {
  corporate_blue: {
    primary: '#2563eb',
    secondary: '#0f766e',
    accent: '#7c3aed',
    style: 'modern_saas',
  },
  dark_mode: {
    primary: '#38bdf8',
    secondary: '#a78bfa',
    accent: '#34d399',
    style: 'high_contrast',
  },
  minimal_white: {
    primary: '#111827',
    secondary: '#475569',
    accent: '#0f766e',
    style: 'minimal',
  },
  neon_gradient: {
    primary: '#06b6d4',
    secondary: '#a855f7',
    accent: '#f43f5e',
    style: 'modern_saas',
  },
  custom_brand: {
    primary: '#10b981',
    secondary: '#0f766e',
    accent: '#f59e0b',
    style: 'executive',
  },
};

const APPLICATION_TYPE_MAP: Record<GenerateSchemaInput['applicationType'], ProjectType> = {
  Website: 'website',
  CRM: 'crm',
  ERP: 'erp',
  'Mobile App': 'mobile_app',
  'SaaS Platform': 'saas_platform',
};

const THEME_MAP: Record<GenerateSchemaInput['theme'], ThemePalette> = {
  'corporate-blue': 'corporate_blue',
  'dark-mode': 'dark_mode',
  'minimal-white': 'minimal_white',
  'neon-gradient': 'neon_gradient',
  'custom-brand': 'custom_brand',
};

const FEATURE_TO_CATEGORY: Record<string, RegistryCategory> = {
  'AI Chatbot': 'integrations',
  'Analytics Dashboard': 'analytics',
  'Payment Gateway': 'billing',
  'WhatsApp Integration': 'integrations',
  Notifications: 'integrations',
  'User Authentication': 'auth',
  'User Management': 'user_management',
  'Customer Management': 'crm_table',
  'Lead Management': 'crm_table',
  'CRM Pipeline': 'crm_table',
  'Product Catalog': 'product_catalog',
  'Inventory Management': 'inventory',
  'Order Management': 'orders',
  'Billing & Invoicing': 'billing',
  'Document Management': 'documents',
  'Appointment Booking': 'calendar',
  'Calendar & Scheduling': 'calendar',
  'Task Management': 'tasks',
  'Project Management': 'tasks',
  'File Uploads': 'files',
  'Email Integration': 'integrations',
  'Live Chat': 'integrations',
  'Reports & Analytics': 'analytics',
  'Multi Language Support': 'integrations',
  'API Integrations': 'integrations',
};

function slugify(value: string) {
  return `/${
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'page'
  }`;
}

function titleFromCategory(category: RegistryCategory) {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function section(
  type: RegistryCategory,
  title: string,
  intent: string,
  content: Record<string, unknown> = {},
  variant?: string,
) {
  return {
    type,
    variant: normalizeVariant(type, variant),
    title,
    intent,
    content,
  };
}

function buildModules(features: string[], applicationType: GenerateSchemaInput['applicationType']) {
  const baseModules = [
    {
      name: `${applicationType} Foundation`,
      description:
        'Core navigation, responsive layouts, role-aware access, and reusable UI patterns.',
      priority: 'must_have' as Priority,
    },
    {
      name: 'Client Presentation Preview',
      description: 'Live preview schema assembled from approved registry components.',
      priority: 'must_have' as Priority,
    },
  ];

  const featureModules = features.slice(0, 8).map((feature, index) => ({
    name: feature,
    description: `Structured ${feature.toLowerCase()} workflow planned for the selected business context.`,
    priority: index < 4 ? ('must_have' as Priority) : ('should_have' as Priority),
  }));

  return [...baseModules, ...featureModules].slice(0, 10);
}

function featureSections(features: string[], limit = 4) {
  const uniqueCategories = Array.from(
    new Set(features.map((feature) => FEATURE_TO_CATEGORY[feature]).filter(Boolean)),
  ).slice(0, limit);

  return uniqueCategories.map((category) =>
    section(
      category,
      titleFromCategory(category),
      `Represent ${titleFromCategory(category).toLowerCase()} using the approved registry variant.`,
      {
        items: features.filter((feature) => FEATURE_TO_CATEGORY[feature] === category).slice(0, 4),
      },
    ),
  );
}

function websitePages(input: GenerateSchemaInput): SolutionPage[] {
  const featureDrivenSections = featureSections(input.features, 3);

  return [
    {
      name: 'Home',
      path: '/',
      purpose: 'Introduce the business, top value proposition, and primary client action.',
      sections: [
        section('navbar', 'Primary Navigation', 'Provide clear access to core website pages.'),
        section('hero', input.name, 'Communicate business value in the first viewport.', {
          headline: `${input.name} for ${input.targetAudience}`,
          subheadline: input.description,
          primary_cta: 'Book a consultation',
        }),
        section('features', 'Services and Capabilities', 'Summarize selected capabilities.', {
          items: input.features.slice(0, 6),
        }),
        ...featureDrivenSections,
        section('contact', 'Contact', 'Capture qualified inquiries from the website preview.'),
      ].slice(0, 7),
    },
    {
      name: 'Services',
      path: '/services',
      purpose: 'Break down services and software capabilities for the client proposal.',
      sections: [
        section('hero', 'Services', 'Frame the business capabilities.'),
        section('features', 'Service Modules', 'Show service categories as reusable modules.', {
          items: input.features.slice(0, 8),
        }),
        section('testimonials', 'Client Proof', 'Reserve space for trust-building proof points.'),
      ],
    },
    {
      name: 'Contact',
      path: '/contact',
      purpose: 'Convert interested visitors into leads.',
      sections: [
        section('contact', 'Contact Form', 'Collect lead details and meeting requests.'),
        section('features', 'Why Contact Us', 'Reinforce the strongest business differentiators.'),
      ],
    },
  ];
}

function crmPages(input: GenerateSchemaInput): SolutionPage[] {
  return [
    {
      name: 'Dashboard',
      path: '/',
      purpose: 'Give sales teams a fast operational overview.',
      sections: [
        section('dashboard', 'CRM Dashboard', 'Show lead, pipeline, and activity metrics.'),
        section('analytics', 'Performance Analytics', 'Track conversion and sales velocity.'),
        section('crm_table', 'Recent Leads', 'Expose the next records requiring follow-up.'),
      ],
    },
    {
      name: 'Leads',
      path: '/leads',
      purpose: 'Manage incoming leads and qualification status.',
      sections: [
        section('crm_table', 'Lead Management', 'Organize leads by status, owner, and priority.'),
        section('integrations', 'Lead Sources', 'Connect forms, email, WhatsApp, and API inputs.'),
      ],
    },
    {
      name: 'Customers',
      path: '/customers',
      purpose: 'Maintain customer profiles and interaction history.',
      sections: [
        section('crm_table', 'Customer Records', 'Display account and contact data.'),
        section('documents', 'Customer Documents', 'Store proposals, contracts, and files.'),
      ],
    },
    {
      name: 'Reports',
      path: '/reports',
      purpose: 'Review sales performance and activity trends.',
      sections: [
        section('analytics', 'Sales Reports', 'Summarize pipeline, revenue, and team activity.'),
      ],
    },
  ];
}

function erpPages(input: GenerateSchemaInput): SolutionPage[] {
  return [
    {
      name: 'Dashboard',
      path: '/',
      purpose: 'Show inventory, orders, billing, and operational risk in one view.',
      sections: [
        section('dashboard', 'ERP Dashboard', 'Summarize enterprise operations.'),
        section('analytics', 'Operational Analytics', 'Track demand, stock, and revenue.'),
      ],
    },
    {
      name: 'Inventory',
      path: '/inventory',
      purpose: 'Track stock levels, SKU movement, and reorder needs.',
      sections: [
        section('inventory', 'Inventory Control', 'Manage items, warehouses, and stock alerts.'),
        section('crm_table', 'Suppliers', 'Maintain supplier and purchase data.'),
      ],
    },
    {
      name: 'Orders',
      path: '/orders',
      purpose: 'Manage purchase, sales, and fulfillment workflows.',
      sections: [
        section('orders', 'Order Management', 'Track order state and fulfillment progress.'),
        section('billing', 'Billing', 'Connect invoices and payment status.'),
      ],
    },
    {
      name: 'Documents',
      path: '/documents',
      purpose: 'Centralize operational documents and approvals.',
      sections: [
        section('documents', 'Document Management', 'Organize bills, contracts, and files.'),
      ],
    },
  ];
}

function mobilePages(input: GenerateSchemaInput): SolutionPage[] {
  return [
    {
      name: 'App Home',
      path: '/',
      purpose: 'Present the mobile app shell and core actions.',
      sections: [
        section('mobile_shell', 'Mobile Home', 'Show mobile-first navigation and actions.'),
        section('features', 'Quick Actions', 'Expose selected mobile capabilities.', {
          items: input.features.slice(0, 6),
        }),
      ],
    },
    {
      name: 'Activity',
      path: '/activity',
      purpose: 'Show user activity, alerts, and recent updates.',
      sections: [
        section('dashboard', 'Activity Feed', 'Summarize recent events for mobile users.'),
        section('integrations', 'Notifications', 'Handle push and external notifications.'),
      ],
    },
    {
      name: 'Account',
      path: '/account',
      purpose: 'Support profile, authentication, and app settings.',
      sections: [section('auth', 'Account Access', 'Provide secure mobile account controls.')],
    },
  ];
}

function saasPages(input: GenerateSchemaInput): SolutionPage[] {
  return [
    {
      name: 'Dashboard',
      path: '/',
      purpose: 'Provide the product control center for users.',
      sections: [
        section(
          'dashboard',
          'SaaS Dashboard',
          'Summarize usage, workflow status, and account health.',
        ),
        section('analytics', 'Analytics Overview', 'Track product and business metrics.'),
        section('features', 'Workspace Modules', 'Expose key product workflows.', {
          items: input.features.slice(0, 6),
        }),
      ],
    },
    {
      name: 'Workspace',
      path: '/workspace',
      purpose: 'Manage the primary product workflow.',
      sections: [
        section('tasks', 'Project Workflows', 'Organize work, tasks, and ownership.'),
        section('files', 'Shared Files', 'Support file uploads and asset access.'),
      ],
    },
    {
      name: 'Users',
      path: '/users',
      purpose: 'Manage users, roles, and organization access.',
      sections: [
        section('user_management', 'Team Management', 'Control user access and roles.'),
        section('auth', 'Authentication', 'Represent login and account security.'),
      ],
    },
    {
      name: 'Billing',
      path: '/billing',
      purpose: 'Show plans, invoices, and payment state.',
      sections: [
        section('pricing', 'Plans', 'Present subscriptions and upgrade paths.'),
        section('billing', 'Invoices', 'Track billing history and payment methods.'),
      ],
    },
  ];
}

function buildPages(input: GenerateSchemaInput) {
  switch (input.applicationType) {
    case 'CRM':
      return crmPages(input);
    case 'ERP':
      return erpPages(input);
    case 'Mobile App':
      return mobilePages(input);
    case 'SaaS Platform':
      return saasPages(input);
    case 'Website':
    default:
      return websitePages(input);
  }
}

export function buildLocalSolutionSchema(input: GenerateSchemaInput): SolutionSchemaType {
  const palette = THEME_MAP[input.theme];
  const baseColors = THEME_COLORS[palette];
  const customColors =
    input.theme === 'custom-brand' && input.customColors
      ? {
          primary: input.customColors.primary,
          secondary: input.customColors.secondary,
          accent: input.customColors.accent,
        }
      : null;

  const recommendedFeatures = Array.from(new Set(input.features)).slice(0, 24);
  const projectType = APPLICATION_TYPE_MAP[input.applicationType];

  return {
    project_type: projectType,
    business: {
      name: input.name,
      description: input.description,
      target_users: input.targetAudience,
      location: input.location || '',
    },
    theme: {
      palette,
      style: baseColors.style,
      primary_color: customColors?.primary || baseColors.primary,
      secondary_color: customColors?.secondary || baseColors.secondary,
      accent_color: customColors?.accent || baseColors.accent,
    },
    summary: `${input.name} is planned as a ${input.applicationType.toLowerCase()} for ${input.targetAudience}. The concept prioritizes ${recommendedFeatures
      .slice(0, 3)
      .join(', ')} with a live, registry-backed preview for client presentation.`,
    recommended_features: recommendedFeatures,
    modules: buildModules(recommendedFeatures, input.applicationType),
    pages: buildPages(input).map((page) => ({
      ...page,
      path: page.path === '/' ? page.path : slugify(page.name),
    })),
    assumptions: [
      'MVP focuses on software planning, UI schema generation, preview rendering, and saved versions.',
      'Generated schemas must use approved registry variants before preview or storage.',
      'Production implementation details remain outside the MVP until explicitly requested.',
    ],
    non_goals: [
      'No complete production database generation.',
      'No mobile binary generation.',
      'No deployment pipeline generation.',
    ],
    registry: {
      version: '2026-06-01',
      allowed_components: REGISTRY_FOR_PROMPT,
    },
  };
}

const THEME_PALETTE_MAP: Record<string, string> = {
  'corporate-blue': 'corporate_blue',
  'dark-mode': 'dark_mode',
  'minimal-white': 'minimal_white',
  'neon-gradient': 'neon_gradient',
  'custom-brand': 'custom_brand',
};

const THEME_PALETTE_TO_STYLE: Record<string, string> = {
  corporate_blue: 'modern_saas',
  dark_mode: 'high_contrast',
  minimal_white: 'minimal',
  neon_gradient: 'modern_saas',
  custom_brand: 'executive',
};

const APP_TYPE_TO_PROJECT_TYPE: Record<string, string> = {
  Website: 'website',
  CRM: 'crm',
  ERP: 'erp',
  'Mobile App': 'mobile_app',
  'SaaS Platform': 'saas_platform',
};

const FEATURE_TO_CATEGORY_PROMPT = Object.entries(FEATURE_TO_CATEGORY).reduce(
  (acc, [feature, category]) => {
    const cat = acc[category] || [];
    cat.push(feature);
    acc[category] = cat;
    return acc;
  },
  {} as Record<string, string[]>,
);

const PAGE_GUIDANCE: Record<string, string> = {
  website:
    'Home (/, hero+features+testimonials+contact), Services (/services, features+testimonials), Contact (/contact, contact+testimonials)',
  crm: 'Dashboard (/, dashboard+analytics+crm_table), Leads (/leads, crm_table+integrations), Customers (/customers, crm_table+documents), Reports (/reports, analytics)',
  erp: 'Dashboard (/, dashboard+analytics), Inventory (/inventory, inventory+crm_table), Orders (/orders, orders+billing), Documents (/documents, documents)',
  mobile_app:
    'App Home (/, mobile_shell+features), Activity (/activity, dashboard+integrations), Account (/account, auth)',
  saas_platform:
    'Dashboard (/, dashboard+analytics+features), Workspace (/workspace, tasks+files), Users (/users, user_management+auth), Billing (/billing, pricing+billing)',
};

export function buildOrchestrationPrompt(input: GenerateSchemaInput) {
  const resolvedPalette: ThemePalette = (THEME_PALETTE_MAP[input.theme] ||
    'corporate_blue') as ThemePalette;
  const resolvedStyle = THEME_PALETTE_TO_STYLE[resolvedPalette] || 'modern_saas';
  const resolvedProjectType: ProjectType = (APP_TYPE_TO_PROJECT_TYPE[input.applicationType] ||
    'website') as ProjectType;
  const themeDefaults = THEME_COLORS[resolvedPalette];

  const isCustom = input.theme === 'custom-brand' && input.customColors;
  const primary_color = isCustom ? input.customColors!.primary : themeDefaults.primary;
  const secondary_color = isCustom ? input.customColors!.secondary : themeDefaults.secondary;
  const accent_color = isCustom ? input.customColors!.accent : themeDefaults.accent;

  const system = [
    'You are the S P Associates AI Software Solution Configurator.',
    'Act as a senior software architect for live client meetings.',
    'Your job is requirements analysis, feature planning, page planning, component selection, and UI schema generation.',
    'Do not generate source code.',
    'Return ONLY valid JSON. No markdown, no code fences, no explanation.',
    'Every page section must use a component type and variant from the provided registry.',
    'Do not invent component names or variants.',
    'The response must strictly conform to the output schema defined below.',
  ].join(' ');

  const prompt = [
    'Generate a SolutionSchema JSON for a software proposal. Follow ALL rules below.',
    '',
    '=== INPUT ===',
    JSON.stringify(
      {
        business_name: input.name,
        application_type: input.applicationType,
        description: input.description,
        target_users: input.targetAudience,
        location: input.location || '',
        selected_features: input.features,
        theme: input.theme,
        variation: input.variation || 'layout',
      },
      null,
      2,
    ),
    '',
    '=== RESOLVED CONFIGURATION (use these values) ===',
    JSON.stringify(
      {
        project_type: resolvedProjectType,
        theme: {
          palette: resolvedPalette,
          style: resolvedStyle,
          primary_color,
          secondary_color,
          accent_color,
        },
      },
      null,
      2,
    ),
    '',
    '=== THEME COLOR REFERENCE ===',
    JSON.stringify(THEME_COLORS, null, 2),
    '',
    '=== COMPONENT REGISTRY (use these exact type/variant values) ===',
    JSON.stringify(REGISTRY_FOR_PROMPT, null, 2),
    '',
    '=== FEATURE TO COMPONENT CATEGORY MAPPING ===',
    JSON.stringify(FEATURE_TO_CATEGORY_PROMPT, null, 2),
    '',
    '=== SUGGESTED PAGE STRUCTURES BY APPLICATION TYPE ===',
    PAGE_GUIDANCE[resolvedProjectType],
    '',
    '=== EXPECTED OUTPUT JSON SCHEMA ===',
    JSON.stringify(
      {
        project_type: resolvedProjectType,
        business: {
          name: input.name,
          description: input.description,
          target_users: input.targetAudience,
          location: input.location || '',
        },
        theme: {
          palette: resolvedPalette,
          style: resolvedStyle,
          primary_color,
          secondary_color,
          accent_color,
        },
        summary: 'A 1-3 sentence summary of the proposed solution',
        recommended_features: [
          'Prioritized list of ALL selected_features plus any additional relevant features Claude recommends (1-24 items)',
        ],
        modules: [
          {
            name: 'Module name (e.g. "CRM Foundation")',
            description: 'What this module provides',
            priority: '"must_have" | "should_have" | "future"',
          },
        ],
        pages: [
          {
            name: 'Page display name',
            path: '/url-path',
            purpose: 'Why this page exists',
            sections: [
              {
                type: 'component_registry key',
                variant: 'registered variant name',
                title: 'Section heading',
                intent: 'What this section should accomplish',
                content: {},
              },
            ],
          },
        ],
        assumptions: ['List of design/planning assumptions'],
        non_goals: ['List of explicit non-goals for this MVP proposal'],
        registry: {
          version: '2026-06-01',
          allowed_components: REGISTRY_FOR_PROMPT,
        },
      },
      null,
      2,
    ),
    '',
    '=== RULES ===',
    [
      '- Return ONLY the JSON object. No markdown fences, no code blocks, no explanation text.',
      '- Include ALL fields shown in the output schema above.',
      '- Use the resolved configuration values EXACTLY for project_type, theme.palette, theme.style, theme.primary_color, theme.secondary_color, and theme.accent_color. Do NOT change or recompute the colors.',
      '- If theme is custom-brand and custom_colors are provided in input, use those custom colors EXACTLY.',
      '- For module priority: selected_features are split as must_have (first 4), should_have (next 4), future (remaining).',
      '- Map each selected_feature to its component category using the feature→category mapping above.',
      '- Create pages appropriate for the application_type using the suggested page structures as a starting point.',
      '- Every section type must be a key from component_registry.',
      '- Every section variant must belong to the matching component_registry array.',
      '- Page paths must start with /.',
      '- Use consistent SaaS UI patterns appropriate for the application_type.',
      '- Create pages a sales executive can present to a client immediately.',
      '- Include 2-5 assumptions about the architecture or planning.',
      '- Include 2-5 non_goals marking what is out of scope for this MVP.',
    ].join('\n'),
  ].join('\n\n');

  return { system, prompt };
}

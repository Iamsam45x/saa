import { NextRequest } from 'next/server';
import { createApiResponse, getAuthUserId } from '@/lib/api-utils';

const COMPONENT_REGISTRY = [
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'layout',
    description: 'Full-width hero with headline, subtitle, and CTA buttons',
    props: {
      headline: { type: 'string', required: true },
      subtitle: { type: 'string', required: false },
      ctas: {
        type: 'array',
        items: {
          type: 'object',
          properties: { label: 'string', href: 'string', variant: 'string' },
        },
      },
      backgroundImage: { type: 'string', required: false },
      overlay: { type: 'boolean', default: true },
    },
    version: '1.0.0',
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    category: 'layout',
    description: 'Grid layout for displaying product/service features',
    props: {
      columns: { type: 'number', default: 3, enum: [2, 3, 4] },
      features: { type: 'array', required: true },
      animated: { type: 'boolean', default: false },
    },
    version: '1.0.0',
  },
  {
    id: 'navigation-bar',
    name: 'Navigation Bar',
    category: 'navigation',
    description: 'Top navigation bar with links, logo, and mobile menu',
    props: {
      items: { type: 'array', required: true },
      sticky: { type: 'boolean', default: true },
      transparent: { type: 'boolean', default: false },
      cta: { type: 'object', required: false },
    },
    version: '1.0.0',
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'forms',
    description: 'Multi-field contact form with validation',
    props: {
      fields: { type: 'array', required: true },
      submitLabel: { type: 'string', default: 'Send Message' },
      showMap: { type: 'boolean', default: false },
    },
    version: '1.0.0',
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    category: 'layout',
    description: 'Tiered pricing display with feature comparison',
    props: {
      plans: { type: 'array', required: true, minItems: 2, maxItems: 4 },
      currency: { type: 'string', default: '$' },
      interval: { type: 'string', enum: ['month', 'year'], default: 'month' },
    },
    version: '1.0.0',
  },
  {
    id: 'testimonial-carousel',
    name: 'Testimonial Carousel',
    category: 'widgets',
    description: 'Rotating customer testimonial cards',
    props: {
      testimonials: { type: 'array', required: true },
      autoPlay: { type: 'boolean', default: true },
      interval: { type: 'number', default: 5000 },
    },
    version: '1.0.0',
  },
  {
    id: 'stats-display',
    name: 'Stats Display',
    category: 'widgets',
    description: 'Animated statistics/counter display',
    props: {
      stats: { type: 'array', required: true },
      columns: { type: 'number', default: 4 },
      animated: { type: 'boolean', default: true },
    },
    version: '1.0.0',
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'layout',
    description: 'Site footer with links, social icons, and copyright',
    props: {
      columns: { type: 'array', required: true },
      socialLinks: { type: 'array', required: false },
      copyright: { type: 'string', required: true },
    },
    version: '1.0.0',
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'data',
    description: 'Sortable, filterable data table with pagination',
    props: {
      columns: { type: 'array', required: true },
      rows: { type: 'array', required: true },
      searchable: { type: 'boolean', default: true },
      pageSize: { type: 'number', default: 10 },
    },
    version: '1.0.0',
  },
  {
    id: 'sidebar-navigation',
    name: 'Sidebar Navigation',
    category: 'navigation',
    description: 'Collapsible sidebar with nested navigation items',
    props: {
      items: { type: 'array', required: true },
      collapsed: { type: 'boolean', default: false },
      header: { type: 'object', required: false },
    },
    version: '1.0.0',
  },
];

export async function GET(request: NextRequest) {
  const userId = getAuthUserId(request);
  if (!userId) {
    return createApiResponse({ components: COMPONENT_REGISTRY });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let filtered = COMPONENT_REGISTRY;
  if (category) {
    filtered = COMPONENT_REGISTRY.filter((c) => c.category === category);
  }

  return createApiResponse({ components: filtered });
}

export type ApplicationType = 'Website' | 'CRM' | 'ERP' | 'Mobile App' | 'SaaS Platform';

export type ThemeType = 'corporate-blue' | 'dark-mode' | 'minimal-white' | 'neon-gradient' | 'custom-brand';

export interface Project {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  location: string;
  applicationType: ApplicationType;
  features: string[];
  theme: ThemeType;
  createdAt: Date;
  updatedAt: Date;
}

export const FEATURES = [
  'AI Chatbot',
  'Analytics Dashboard',
  'Payment Gateway',
  'WhatsApp Integration',
  'Notifications',
  'User Authentication',
  'User Management',
  'Customer Management',
  'Lead Management',
  'CRM Pipeline',
  'Product Catalog',
  'Inventory Management',
  'Order Management',
  'Billing & Invoicing',
  'Document Management',
  'Appointment Booking',
  'Calendar & Scheduling',
  'Task Management',
  'Project Management',
  'File Uploads',
  'Email Integration',
  'Live Chat',
  'Reports & Analytics',
  'Multi-Language Support',
  'API Integrations',
] as const;

export const THEMES = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
    },
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6d28d9',
      accent: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
    },
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    colors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      accent: '#71717a',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#09090b',
    },
  },
  {
    id: 'neon-gradient',
    name: 'Neon Gradient',
    colors: {
      primary: '#06b6d4',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0c0a1d',
      surface: '#1a1625',
      text: '#faf5ff',
    },
  },
  {
    id: 'custom-brand',
    name: 'Custom Brand',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
    },
  },
] as const;

export type Feature = typeof FEATURES[number];

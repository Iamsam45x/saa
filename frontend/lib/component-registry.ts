export const COMPONENT_REGISTRY = {
  hero: ['Hero_1', 'Hero_2', 'Hero_3'],
  navbar: ['Navbar_1', 'Navbar_2'],
  features: ['Features_1', 'Features_2'],
  pricing: ['Pricing_1', 'Pricing_2'],
  testimonials: ['Testimonials_1', 'Testimonials_2'],
  contact: ['Contact_1', 'Contact_2'],
  dashboard: ['Dashboard_1', 'Dashboard_2'],
  crm_table: ['CRMTable_1', 'CRMTable_2'],
  analytics: ['Analytics_1', 'Analytics_2'],
  auth: ['Auth_1', 'Auth_2'],
  user_management: ['UserManagement_1', 'UserManagement_2'],
  product_catalog: ['ProductCatalog_1', 'ProductCatalog_2'],
  inventory: ['Inventory_1', 'Inventory_2'],
  orders: ['Orders_1', 'Orders_2'],
  billing: ['Billing_1', 'Billing_2'],
  documents: ['Documents_1', 'Documents_2'],
  calendar: ['Calendar_1', 'Calendar_2'],
  tasks: ['Tasks_1', 'Tasks_2'],
  files: ['Files_1', 'Files_2'],
  integrations: ['Integrations_1', 'Integrations_2'],
  mobile_shell: ['MobileShell_1', 'MobileShell_2'],
} as const;

export type RegistryCategory = keyof typeof COMPONENT_REGISTRY;
export type RegistryVariant = (typeof COMPONENT_REGISTRY)[RegistryCategory][number];

export const REGISTRY_CATEGORIES = Object.keys(COMPONENT_REGISTRY) as RegistryCategory[];

export function getRegistryVariants(category: RegistryCategory) {
  return COMPONENT_REGISTRY[category];
}

export function isRegistryCategory(value: string): value is RegistryCategory {
  return value in COMPONENT_REGISTRY;
}

export function isRegisteredVariant(category: string, variant: string) {
  if (!isRegistryCategory(category)) return false;
  return (COMPONENT_REGISTRY[category] as readonly string[]).includes(variant);
}

export function getDefaultVariant(category: RegistryCategory) {
  return COMPONENT_REGISTRY[category][0];
}

export const REGISTRY_FOR_PROMPT = Object.entries(COMPONENT_REGISTRY).reduce(
  (acc, [category, variants]) => {
    acc[category] = [...variants];
    return acc;
  },
  {} as Record<string, string[]>,
);

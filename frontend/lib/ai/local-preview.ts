import type { SolutionSchemaType } from '@/lib/solution-schema';

interface LocalPreviewInput {
  name: string;
  description: string;
  targetAudience: string;
  location: string;
  applicationType: string;
  features: string[];
  theme: string;
  schema: SolutionSchemaType;
}

function cssColor(hex: string): string {
  return hex || '#6366f1';
}

function pageSections(schema: SolutionSchemaType): string {
  return schema.pages
    .map(
      (page, pi) => `
  <div x-show="activeTab === 'page-${pi}'" x-transition:enter.duration.200ms>
    ${page.sections
      .map((section) => renderSection(section, schema))
      .filter(Boolean)
      .join('')}
  </div>`,
    )
    .join('');
}

function renderSection(
  section: { type: string; title: string; intent: string; content?: Record<string, unknown> },
  schema: SolutionSchemaType,
): string {
  const pc = cssColor(schema.theme.primary_color);
  const sc = cssColor(schema.theme.secondary_color);
  const ac = cssColor(schema.theme.accent_color);

  switch (section.type) {
    case 'hero':
      return `
    <div class="px-6 py-16 md:py-24" style="background:linear-gradient(135deg,${pc}15,${sc}15)">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-4" style="background:linear-gradient(135deg,${pc},${sc});-webkit-background-clip:text;-webkit-text-fill-color:transparent">${escHtml(section.title)}</h1>
        <p class="text-lg md:text-xl mb-8" style="color:${sc}cc">${escHtml(section.intent)}</p>
        <div class="flex gap-4 justify-center">
          <span class="px-6 py-3 rounded-lg font-semibold text-white shadow-lg cursor-pointer" style="background:linear-gradient(135deg,${pc},${sc})">Get Started</span>
          <span class="px-6 py-3 rounded-lg font-semibold border-2 cursor-pointer" style="border-color:${pc};color:${pc}">Learn More</span>
        </div>
      </div>
    </div>`;

    case 'features': {
      const items = (section.content?.items as string[]) || [];
      const grid = items.length
        ? items
            .map(
              (f) => `
          <div class="p-4 rounded-xl border text-center hover:shadow-md transition-shadow" style="background:white;border-color:${pc}20">
            <div class="w-10 h-10 rounded-lg mb-3 mx-auto" style="background:${pc}15"></div>
            <p class="font-semibold text-sm" style="color:#1e293b">${escHtml(f)}</p>
          </div>`,
            )
            .join('')
        : '';
      return `
    <div class="px-6 py-10" style="background:white">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-8" style="color:#1e293b">${escHtml(section.title)}</h2>
        ${grid ? `<div class="grid grid-cols-2 md:grid-cols-3 gap-4">${grid}</div>` : `<p class="text-center" style="color:#64748b">${escHtml(section.intent)}</p>`}
      </div>
    </div>`;
    }

    case 'crm_table':
    case 'inventory':
    case 'orders': {
      const headers = ['Name', 'Status', 'Email', 'Date'];
      const statuses = ['Active', 'Pending', 'Completed', 'Review'];
      const rows = Array.from({ length: 5 }, (_, i) => ({
        name: `${section.type === 'orders' ? 'Order' : 'Record'} #${1000 + i}`,
        status: statuses[i % statuses.length],
        email: `contact${i}@example.com`,
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      }));
      return `
    <div class="px-6 py-6" style="background:#f8fafc">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold" style="color:#1e293b">${escHtml(section.title)}</h2>
          <button type="button" @click="openAddModal('${escHtml(section.title)}')" class="px-4 py-2 rounded-lg text-white text-sm font-semibold" style="background:${pc}">+ Add</button>
        </div>
        <div class="mb-3">
          <input type="text" x-model="searchQuery" placeholder="Search..." class="w-full px-3 py-2 rounded-lg border text-sm" style="border-color:#e2e8f0">
        </div>
        <div class="rounded-xl border overflow-hidden bg-white" style="border-color:#e2e8f0">
          <div class="grid grid-cols-4 gap-0 text-xs font-semibold px-4 py-3" style="background:${pc}08;color:#475569">
            <span>${headers[0]}</span><span>${headers[1]}</span><span>${headers[2]}</span><span>${headers[3]}</span>
          </div>
          ${rows
            .map((r, i) => {
              const statusColor =
                r.status === 'Active'
                  ? '#16a34a'
                  : r.status === 'Pending'
                    ? '#d97706'
                    : r.status === 'Completed'
                      ? '#6366f1'
                      : '#94a3b8';
              return `
          <div class="grid grid-cols-4 gap-0 text-xs px-4 py-3 border-t items-center" style="border-color:#f1f5f9">
            <span style="color:#1e293b">${escHtml(r.name)}</span>
            <span><span class="px-2 py-0.5 rounded-full text-xs font-medium" style="background:${statusColor}15;color:${statusColor}">${r.status}</span></span>
            <span style="color:#64748b">${r.email}</span>
            <span style="color:#64748b">${r.date}</span>
          </div>`;
            })
            .join('')}
        </div>
      </div>
    </div>`;
    }

    case 'dashboard': {
      const cards = [
        { label: 'Total Users', value: '2,847', change: '+12%' },
        { label: 'Revenue', value: '$128K', change: '+8%' },
        { label: 'Active Now', value: '1,432', change: '+23%' },
        { label: 'Growth Rate', value: '14.5%', change: '+2.1%' },
      ];
      return `
    <div class="px-6 py-6" style="background:#f8fafc">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold mb-6" style="color:#1e293b">${escHtml(section.title)}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${cards
            .map(
              (c) => `
          <div class="p-4 rounded-xl border bg-white shadow-sm" style="border-color:#e2e8f0">
            <p class="text-xs mb-1" style="color:#64748b">${c.label}</p>
            <p class="text-2xl font-bold" style="color:#1e293b">${c.value}</p>
            <p class="text-xs mt-1" style="color:${c.change.startsWith('+') ? '#16a34a' : '#dc2626'}">${c.change}</p>
          </div>`,
            )
            .join('')}
        </div>
      </div>
    </div>`;
    }

    case 'analytics': {
      return `
    <div class="px-6 py-6" style="background:white">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold mb-6" style="color:#1e293b">${escHtml(section.title)}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border" style="border-color:#e2e8f0">
            <p class="text-xs mb-3" style="color:#64748b">Monthly Views</p>
            <div class="flex items-end gap-2 h-24">
              ${[45, 62, 38, 75, 88, 52, 91].map((h) => `<div class="flex-1 rounded-t" style="height:${h}%;background:${pc}"></div>`).join('')}
            </div>
          </div>
          <div class="p-4 rounded-xl border" style="border-color:#e2e8f0">
            <p class="text-xs mb-3" style="color:#64748b">Conversion Rate</p>
            <p class="text-3xl font-bold" style="color:${pc}">3.24%</p>
            <p class="text-xs mt-1" style="color:#16a34a">+0.8% vs last month</p>
          </div>
        </div>
      </div>
    </div>`;
    }

    case 'pricing': {
      const plans = [
        {
          name: 'Starter',
          price: '$29',
          features: ['Up to 5 users', 'Basic analytics', 'Email support', '1GB storage'],
        },
        {
          name: 'Professional',
          price: '$79',
          features: [
            'Up to 25 users',
            'Advanced analytics',
            'Priority support',
            '10GB storage',
            'API access',
          ],
          popular: true,
        },
        {
          name: 'Enterprise',
          price: '$199',
          features: [
            'Unlimited users',
            'Custom analytics',
            'Dedicated support',
            '100GB storage',
            'API access',
            'SLA',
          ],
        },
      ];
      return `
    <div class="px-6 py-10" style="background:#f8fafc">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-8" style="color:#1e293b">${escHtml(section.title)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${plans
            .map(
              (plan) => `
          <div class="p-6 rounded-xl border bg-white shadow-sm relative ${plan.popular ? 'ring-2' : ''}" style="${plan.popular ? `border-color:${pc};ring-color:${pc}` : 'border-color:#e2e8f0'}">
            ${plan.popular ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white" style="background:${pc}">Most Popular</span>` : ''}
            <h3 class="text-lg font-bold mb-1" style="color:#1e293b">${plan.name}</h3>
            <p class="text-3xl font-bold mb-4" style="color:${pc}">${plan.price}<span class="text-sm font-normal" style="color:#64748b">/mo</span></p>
            <ul class="space-y-2 mb-6">
              ${plan.features.map((f) => `<li class="flex items-center gap-2 text-xs" style="color:#475569"><span style="color:${pc}">✓</span>${f}</li>`).join('')}
            </ul>
            <button type="button" class="w-full py-2.5 rounded-lg text-sm font-semibold text-white" style="background:${plan.popular ? pc : '#e2e8f0'};color:${plan.popular ? 'white' : '#475569'}">Choose ${plan.name}</button>
          </div>`,
            )
            .join('')}
        </div>
      </div>
    </div>`;
    }

    case 'testimonials': {
      return `
    <div class="px-6 py-10" style="background:white">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-8" style="color:#1e293b">${escHtml(section.title)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 rounded-xl border" style="border-color:#e2e8f0;background:#f8fafc">
            <p class="text-sm italic mb-3" style="color:#475569">&ldquo;This platform transformed how we manage our business. The insights are invaluable.&rdquo;</p>
            <p class="text-xs font-semibold" style="color:${pc}">— Sarah Mitchell, CEO</p>
          </div>
          <div class="p-6 rounded-xl border" style="border-color:#e2e8f0;background:#f8fafc">
            <p class="text-sm italic mb-3" style="color:#475569">&ldquo;Incredible ROI within the first month. The team loved the intuitive interface.&rdquo;</p>
            <p class="text-xs font-semibold" style="color:${pc}">— James Chen, CTO</p>
          </div>
        </div>
      </div>
    </div>`;
    }

    case 'contact':
      return `
    <div class="px-6 py-10 text-white text-center" style="background:${pc}">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-2">${escHtml(section.title)}</h2>
        <p class="mb-6 opacity-90">${escHtml(section.intent)}</p>
        <button type="button" class="px-6 py-3 rounded-lg font-semibold shadow-lg" style="background:white;color:${pc}">Contact Us</button>
      </div>
    </div>`;

    case 'navbar':
      return '';

    case 'user_management':
    case 'auth':
    case 'integrations':
    case 'documents':
    case 'files':
    case 'tasks':
    case 'billing':
    case 'calendar':
    case 'mobile_shell':
    case 'product_catalog':
      return `
    <div class="px-6 py-10" style="background:white">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold mb-3" style="color:#1e293b">${escHtml(section.title)}</h2>
        <p class="text-sm mb-6" style="color:#64748b">${escHtml(section.intent)}</p>
        <div class="p-8 rounded-xl border-2 border-dashed text-center" style="border-color:#e2e8f0;background:#f8fafc">
          <p class="text-sm" style="color:#94a3b8">${escHtml(section.title)} module content will appear here</p>
        </div>
      </div>
    </div>`;

    default:
      return `
    <div class="px-6 py-6 border-b" style="background:white;border-color:#f1f5f9">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-lg font-bold" style="color:#1e293b">${escHtml(section.title)}</h2>
        <p class="text-sm mt-1" style="color:#64748b">${escHtml(section.intent)}</p>
      </div>
    </div>`;
  }
}

function escHtml(s: string): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildLocalPreview(input: LocalPreviewInput): string {
  const schema = input.schema;
  const pc = cssColor(schema.theme.primary_color);
  const sc = cssColor(schema.theme.secondary_color);
  const ac = cssColor(schema.theme.accent_color);

  const navItems = schema.pages.map((page, i) => ({
    id: `page-${i}`,
    label: page.name,
    icon: i === 0 ? 'layout-dashboard' : i === 1 ? 'list' : i === 2 ? 'users' : 'settings',
  }));

  const navHtml = navItems
    .map(
      (item) => `
          <button type="button" @click="activeTab = '${item.id}'" class="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all" :class="activeTab === '${item.id}' ? 'text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'" :style="activeTab === '${item.id}' ? { background: '${pc}' } : {}">
            <i data-lucide="${item.icon}" class="h-4 w-4 shrink-0"></i>
            <span class="hidden md:inline">${escHtml(item.label)}</span>
          </button>`,
    )
    .join('');

  const bottomNavHtml = navItems
    .map(
      (item) => `
          <button type="button" @click="activeTab = '${item.id}'" class="flex flex-col items-center gap-0.5 flex-1 py-1 text-[10px] font-medium transition-colors" :class="activeTab === '${item.id}' ? 'text-white' : 'text-gray-500'" :style="activeTab === '${item.id}' ? { color: '${pc}' } : {}">
            <i data-lucide="${item.icon}" class="h-4 w-4"></i>
            <span class="truncate max-w-[64px]">${escHtml(item.label)}</span>
          </button>`,
    )
    .join('');

  const pagesHtml = pageSections(schema);

  const featureNames = schema.pages.flatMap((p) => p.sections.map((s) => s.title));
  const localStorageKeys = [
    ...new Set(featureNames.map((f) => f.toLowerCase().replace(/\s+/g, '_'))),
  ];

  const initData = localStorageKeys
    .map((key) => {
      const items = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        status: ['Active', 'Pending', 'Completed'][i % 3],
        description: `Description for item ${i + 1}`,
      }));
      return `        if (!localStorage.getItem('app_${key}')) localStorage.setItem('app_${key}', '${escHtml(JSON.stringify(items))}');
        this.${key} = JSON.parse(localStorage.getItem('app_${key}') || '[]');`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(input.name)} - Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;min-height:100vh}
    .sidebar-scroll::-webkit-scrollbar{width:4px}
    .sidebar-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
  </style>
</head>
<body>
  <div x-data="{
    activeTab: 'page-0',
    searchQuery: '',
    showModal: false,
    modalMode: 'add',
    selectedItem: null,
    currentView: '',
${localStorageKeys.map((key) => `    ${key}: [],`).join('\n')}
    init() {
${initData}
    },
    filteredItems(view) {
      const items = this[view] || [];
      if (!this.searchQuery) return items;
      const q = this.searchQuery.toLowerCase();
      return items.filter(item => JSON.stringify(item).toLowerCase().includes(q));
    },
    openAddModal(view) {
      this.currentView = view;
      this.modalMode = 'add';
      this.selectedItem = {};
      this.showModal = true;
    },
    openEditModal(view, item) {
      this.currentView = view;
      this.modalMode = 'edit';
      this.selectedItem = {...item};
      this.showModal = true;
    },
    openDeleteModal(view, item) {
      this.currentView = view;
      this.modalMode = 'delete';
      this.selectedItem = item;
      this.showModal = true;
    },
    saveItem() {
      const view = this.currentView;
      const key = 'app_' + view;
      if (this.modalMode === 'add') {
        this.selectedItem.id = Date.now();
        this[view].push({...this.selectedItem});
      } else if (this.modalMode === 'edit') {
        const idx = this[view].findIndex(i => i.id === this.selectedItem.id);
        if (idx !== -1) this[view][idx] = {...this.selectedItem};
      } else if (this.modalMode === 'delete') {
        this[view] = this[view].filter(i => i.id !== this.selectedItem.id);
      }
      localStorage.setItem(key, JSON.stringify(this[view]));
      this.showModal = false;
      this.selectedItem = null;
    }
  }" class="h-screen flex flex-col md:flex-row overflow-hidden">
    <aside class="hidden md:flex md:w-64 flex-col shrink-0" style="background:#0f172a">
      <div class="px-4 py-4 border-b border-white/10">
        <h1 class="text-sm font-bold text-white truncate">${escHtml(input.name)}</h1>
        <p class="text-[10px] mt-0.5 text-gray-500">${escHtml(input.applicationType)}</p>
      </div>
      <nav class="flex-1 overflow-y-auto p-3 space-y-1 sidebar-scroll">
        ${navHtml}
      </nav>
      <div class="px-4 py-3 border-t border-white/10">
        <p class="text-[10px] text-gray-600">Built with Alpine.js</p>
      </div>
    </aside>

    <nav class="md:hidden flex items-center justify-around border-t shrink-0" style="background:#0f172a;border-color:rgba(255,255,255,0.1)">
      ${bottomNavHtml}
    </nav>

    <main class="flex-1 overflow-y-auto" style="background:#f8fafc">
      ${pagesHtml}
    </main>

    <template x-teleport="body">
      <div x-show="showModal" x-transition.opacity.duration.200s class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.5)">
        <div @click.outside="showModal = false" class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:#e2e8f0">
            <h3 class="text-lg font-bold" style="color:#1e293b" x-text="modalMode === 'add' ? 'Add ' + currentView : modalMode === 'edit' ? 'Edit ' + currentView : 'Delete ' + currentView"></h3>
            <button type="button" @click="showModal = false" class="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <div class="p-6">
            <template x-if="modalMode !== 'delete'">
              <div class="space-y-4">
                <template x-for="(val, field) in selectedItem" :key="field">
                  <div>
                    <label class="block text-xs font-medium mb-1" style="color:#475569" x-text="field.charAt(0).toUpperCase() + field.slice(1)"></label>
                    <input type="text" x-model="selectedItem[field]" class="w-full px-3 py-2 rounded-lg border text-sm" style="border-color:#e2e8f0" :disabled="field === 'id'" />
                  </div>
                </template>
              </div>
            </template>
            <template x-if="modalMode === 'delete'">
              <div>
                <p class="text-sm" style="color:#475569">Are you sure you want to delete this item? This action cannot be undone.</p>
                <p class="text-sm font-semibold mt-2" style="color:#1e293b" x-text="selectedItem?.name || selectedItem?.id"></p>
              </div>
            </template>
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t" style="border-color:#e2e8f0">
            <button type="button" @click="showModal = false" class="px-4 py-2 rounded-lg text-sm font-medium" style="background:#f1f5f9;color:#475569">Cancel</button>
            <button type="button" @click="saveItem()" class="px-4 py-2 rounded-lg text-sm font-semibold text-white" :style="{ background: modalMode === 'delete' ? '#dc2626' : '${pc}' }" x-text="modalMode === 'delete' ? 'Delete' : 'Save'"></button>
          </div>
        </div>
      </div>
    </template>
  </div>
  <script>document.addEventListener('DOMContentLoaded',function(){if(typeof lucide!=='undefined'&&lucide.createIcons)lucide.createIcons()});</script>
</body>
</html>`;
}

import React from 'react';
import type { SolutionSection, SolutionSchemaType } from '@/lib/solution-schema';
import type { RegistryCategory } from '@/lib/component-registry';

interface RenderContext {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  businessName: string;
}

function heroRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const tagline = (section.content?.tagline as string) || section.intent;
  const cta = (section.content?.cta as string) || 'Get Started';
  return (
    <div
      className="flex items-center justify-center px-8 py-16"
      style={{ background: `linear-gradient(135deg, ${c.primary}15, ${c.secondary}15)` }}
    >
      <div className="text-center max-w-3xl">
        <span
          className="text-4xl font-bold mb-3 block"
          style={{
            background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {section.title}
        </span>
        <p className="text-base mb-5" style={{ color: `${c.text}aa` }}>
          {tagline}
        </p>
        <div className="flex gap-3 justify-center">
          <span
            className="px-5 py-2.5 rounded-lg font-semibold text-white text-sm shadow-lg"
            style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
          >
            {cta}
          </span>
          <span
            className="px-5 py-2.5 rounded-lg font-semibold text-sm border shadow-sm"
            style={{ borderColor: c.primary, color: c.primary }}
          >
            Learn More
          </span>
        </div>
      </div>
    </div>
  );
}

function navbarRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const items = (section.content?.links as string[]) || ['Home', 'About', 'Services', 'Contact'];
  return (
    <div
      className="px-6 py-3 border-b flex items-center justify-between"
      style={{ backgroundColor: c.surface, borderColor: `${c.text}20` }}
    >
      <span className="font-bold text-base" style={{ color: c.text }}>
        {ctx.businessName}
      </span>
      <div className="flex gap-5">
        {items.slice(0, 5).map((item) => (
          <span key={item} className="text-xs font-medium" style={{ color: `${c.text}cc` }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function featuresRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const items =
    (section.content?.items as string[]) || (section.content?.features as string[]) || [];
  return (
    <div className="px-8 py-8" style={{ backgroundColor: c.surface }}>
      <div className="text-center mb-5">
        <h3 className="text-xl font-bold" style={{ color: c.text }}>
          {section.title}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(items.length ? items : ['Feature A', 'Feature B', 'Feature C'])
          .slice(0, 6)
          .map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border text-center"
              style={{ backgroundColor: c.background, borderColor: `${c.text}20` }}
            >
              <span className="text-xs font-semibold" style={{ color: c.text }}>
                {item}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function pricingRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const plans =
    (section.content?.plans as { name: string; price: string; features: string[] }[]) || [];
  return (
    <div className="px-8 py-8" style={{ backgroundColor: c.background }}>
      <h3 className="text-xl font-bold text-center mb-5" style={{ color: c.text }}>
        {section.title}
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {(plans.length
          ? plans
          : [
              { name: 'Starter', price: '$29', features: ['Basic', 'Support'] },
              { name: 'Pro', price: '$79', features: ['Advanced', 'Priority'] },
              { name: 'Enterprise', price: '$199', features: ['Custom', 'Dedicated'] },
            ]
        )
          .slice(0, 3)
          .map((plan, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border shadow-sm text-center"
              style={{ backgroundColor: c.surface, borderColor: `${c.text}10` }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: c.text }}>
                {plan.name}
              </p>
              <p className="text-2xl font-bold mb-3" style={{ color: c.primary }}>
                {plan.price}
              </p>
              {(plan.features || []).map((f, j) => (
                <p key={j} className="text-xs py-1" style={{ color: `${c.text}99` }}>
                  {f}
                </p>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

function testimonialsRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const items = (section.content?.testimonials as { quote: string; author: string }[]) || [];
  return (
    <div className="px-8 py-8" style={{ backgroundColor: c.surface }}>
      <h3 className="text-xl font-bold text-center mb-5" style={{ color: c.text }}>
        {section.title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {(items.length
          ? items
          : [
              { quote: 'Amazing service!', author: 'John D.' },
              { quote: 'Transformed our business.', author: 'Sarah K.' },
            ]
        )
          .slice(0, 4)
          .map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: c.background, borderColor: `${c.text}15` }}
            >
              <p className="text-sm italic mb-2" style={{ color: c.text }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-xs font-semibold" style={{ color: c.primary }}>
                — {t.author}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

function contactRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  return (
    <div className="px-8 py-8 text-white text-center" style={{ backgroundColor: c.primary }}>
      <h3 className="text-lg font-bold mb-1">{section.title}</h3>
      <p className="text-sm opacity-90 mb-4">
        {(section.content?.subtitle as string) || 'Get in touch with us today'}
      </p>
      <span
        className="px-5 py-2 rounded-lg font-semibold text-sm shadow-lg inline-block"
        style={{ backgroundColor: '#fff', color: c.primary }}
      >
        {(section.content?.cta as string) || 'Contact Us'}
      </span>
    </div>
  );
}

function dashboardRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const stats = (section.content?.stats as { label: string; value: string }[]) || [];
  return (
    <div className="px-6 py-4">
      <h3 className="text-base font-bold mb-3" style={{ color: c.text }}>
        {section.title}
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {(stats.length
          ? stats
          : [
              { label: 'Users', value: '2,847' },
              { label: 'Revenue', value: '$128K' },
              { label: 'Orders', value: '1,432' },
              { label: 'Growth', value: '+23%' },
            ]
        )
          .slice(0, 4)
          .map((s, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border shadow-sm"
              style={{ backgroundColor: c.surface, borderColor: `${c.text}10` }}
            >
              <p className="text-[10px] mb-0.5" style={{ color: `${c.text}99` }}>
                {s.label}
              </p>
              <p className="text-lg font-bold" style={{ color: c.text }}>
                {s.value}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

function crmTableRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const headers = (section.content?.headers as string[]) || ['Name', 'Email', 'Status'];
  const rows = (section.content?.rows as string[][]) || [
    ['Alice', 'alice@co', 'Active'],
    ['Bob', 'bob@co', 'Lead'],
  ];
  return (
    <div className="px-6 py-4">
      <h3 className="text-base font-bold mb-3" style={{ color: c.text }}>
        {section.title}
      </h3>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: `${c.text}15` }}>
        <div
          className="grid grid-cols-3 gap-0 text-xs font-semibold"
          style={{ backgroundColor: `${c.primary}10`, color: c.text }}
        >
          {headers.slice(0, 5).map((h) => (
            <div key={h} className="px-3 py-2">
              {h}
            </div>
          ))}
        </div>
        {rows.slice(0, 4).map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-3 gap-0 text-xs border-t"
            style={{ borderColor: `${c.text}10`, color: c.text }}
          >
            {row.slice(0, 5).map((cell, j) => (
              <div key={j} className="px-3 py-2">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function analyticsRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const metrics =
    (section.content?.metrics as { label: string; value: string; change: string }[]) || [];
  return (
    <div className="px-6 py-4">
      <h3 className="text-base font-bold mb-3" style={{ color: c.text }}>
        {section.title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {(metrics.length
          ? metrics
          : [
              { label: 'Page Views', value: '45.2K', change: '+12%' },
              { label: 'Bounce Rate', value: '24%', change: '-3%' },
            ]
        )
          .slice(0, 4)
          .map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border"
              style={{ backgroundColor: c.surface, borderColor: `${c.text}10` }}
            >
              <p className="text-[10px]" style={{ color: `${c.text}99` }}>
                {m.label}
              </p>
              <p className="text-base font-bold" style={{ color: c.text }}>
                {m.value}
              </p>
              <p
                className="text-[10px]"
                style={{ color: m.change.startsWith('+') ? '#16a34a' : '#dc2626' }}
              >
                {m.change}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

function mobileShellRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  const items = (section.content?.apps as { name: string; color?: string }[]) || [];
  return (
    <div className="flex items-center justify-center p-4" style={{ backgroundColor: c.background }}>
      <div
        className="rounded-[32px] border-4 overflow-hidden shadow-xl w-64"
        style={{ borderColor: '#1a1a1a' }}
      >
        <div
          className="px-3 py-1 pt-6 text-center text-[10px] text-white font-medium"
          style={{ backgroundColor: c.primary }}
        >
          9:41
        </div>
        <div className="px-4 py-4" style={{ backgroundColor: c.background }}>
          <p className="text-sm font-bold text-center mb-3" style={{ color: c.text }}>
            {section.title}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(items.length
              ? items
              : [
                  { name: 'Chat' },
                  { name: 'Stats' },
                  { name: 'Pay' },
                  { name: 'Users' },
                  { name: 'Files' },
                  { name: 'Settings' },
                ]
            )
              .slice(0, 6)
              .map((app, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-2 rounded-lg border"
                  style={{ backgroundColor: c.surface, borderColor: `${c.text}10` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg mb-1"
                    style={{ backgroundColor: app.color || `${c.primary}20` }}
                  />
                  <span className="text-[9px] font-medium" style={{ color: c.text }}>
                    {app.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function genericRenderer(section: SolutionSection, ctx: RenderContext) {
  const c = ctx.colors;
  return (
    <div
      className="px-6 py-4 border-b"
      style={{ backgroundColor: c.surface, borderColor: `${c.text}10` }}
    >
      <p className="text-sm font-bold" style={{ color: c.text }}>
        {section.title}
      </p>
      <p className="text-xs mt-1" style={{ color: `${c.text}88` }}>
        {section.intent}
      </p>
    </div>
  );
}

const RENDERERS: Partial<
  Record<RegistryCategory, (section: SolutionSection, ctx: RenderContext) => React.ReactNode>
> = {
  hero: heroRenderer,
  navbar: navbarRenderer,
  features: featuresRenderer,
  pricing: pricingRenderer,
  testimonials: testimonialsRenderer,
  contact: contactRenderer,
  dashboard: dashboardRenderer,
  crm_table: crmTableRenderer,
  analytics: analyticsRenderer,
  mobile_shell: mobileShellRenderer,
};

export function renderSection(section: SolutionSection, ctx: RenderContext): React.ReactNode {
  const renderer = RENDERERS[section.type];
  if (!renderer) return genericRenderer(section, ctx);
  return renderer(section, ctx);
}

export function renderSchemaPreview(schema: SolutionSchemaType): React.ReactNode {
  const ctx: RenderContext = {
    colors: {
      primary: schema.theme.primary_color,
      secondary: schema.theme.secondary_color,
      accent: schema.theme.accent_color,
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
    },
    businessName: schema.business.name,
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: ctx.colors.background }}>
      {schema.pages.flatMap((page) =>
        page.sections.map((section, i) => (
          <div key={`${page.path}-${i}`}>{renderSection(section, ctx)}</div>
        )),
      )}
    </div>
  );
}

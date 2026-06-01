'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/store/builder-store';
import { type ApplicationType, type ThemeType, THEMES } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor, Tablet, Smartphone, RefreshCw, Eye, EyeOff } from 'lucide-react';

const DEVICES = [
  { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
  { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
  { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
];

const DEVICE_WIDTHS: Record<string, string> = {
  desktop: 'w-full',
  tablet: 'w-[768px]',
  mobile: 'w-[375px]',
};

interface PreviewSkeletonProps {
  applicationType: ApplicationType;
}

function PreviewSkeleton({ applicationType }: PreviewSkeletonProps) {
  return (
    <div className="h-full flex flex-col p-4 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-12" />
          ))}
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

const themeColors = THEMES.reduce(
  (acc, t) => {
    acc[t.id] = t.colors;
    return acc;
  },
  {} as Record<
    string,
    {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
    }
  >,
);

function getEffectiveColors(theme: ThemeType) {
  if (theme === 'custom-brand') {
    const root = document.documentElement;
    return {
      primary: root.style.getPropertyValue('--custom-primary') || '#10b981',
      secondary: root.style.getPropertyValue('--custom-secondary') || '#059669',
      accent: root.style.getPropertyValue('--custom-accent') || '#34d399',
      background: root.style.getPropertyValue('--custom-background') || '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
    };
  }
  return themeColors[theme] || themeColors['corporate-blue'];
}

function renderWebsitePreview(
  projectName: string,
  selectedFeatures: string[],
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  },
) {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ backgroundColor: colors.surface, borderColor: `${colors.text}20` }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg" style={{ color: colors.text }}>
            {projectName || 'Company'}
          </span>
        </div>
        <div className="flex gap-6">
          {['Home', 'About', 'Services', 'Contact'].map((item) => (
            <span
              key={item}
              className="text-sm font-medium cursor-pointer"
              style={{ color: `${colors.text}cc` }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div
        className="flex-1 flex items-center justify-center px-8 py-12"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
        }}
      >
        <div className="text-center max-w-3xl">
          <span
            className="text-5xl font-bold mb-4 block"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {projectName || 'Your Business Name'}
          </span>
          <p className="text-lg mb-6" style={{ color: `${colors.text}aa` }}>
            Empowering your business with innovative solutions
          </p>
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Get Started
            </button>
            <button
              className="px-6 py-3 rounded-lg font-semibold border shadow-sm"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-10" style={{ backgroundColor: colors.surface }}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            Our Features
          </h3>
          <p className="text-sm" style={{ color: `${colors.text}99` }}>
            Discover what makes us different
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {selectedFeatures.slice(0, 6).map((feature, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border shadow-sm"
              style={{ backgroundColor: colors.background, borderColor: `${colors.text}20` }}
            >
              <span className="text-sm font-semibold" style={{ color: colors.text }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-8 py-8" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-lg font-bold mb-1">Ready to get started?</p>
            <p className="text-sm opacity-90">Contact us today for a free consultation</p>
          </div>
          <button className="px-6 py-3 bg-white rounded-lg font-semibold shadow-lg">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

function renderCRMPreview(
  projectName: string,
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  },
) {
  return (
    <div className="h-full flex" style={{ backgroundColor: colors.background }}>
      <div
        className="w-48 border-r"
        style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
      >
        <div className="px-4 py-4 border-b" style={{ borderColor: `${colors.text}10` }}>
          <span className="font-bold text-sm" style={{ color: colors.text }}>
            {projectName || 'CRM Pro'}
          </span>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {['Dashboard', 'Customers', 'Leads', 'Deals', 'Reports'].map((label, idx) => (
            <div
              key={label}
              className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: idx === 0 ? colors.primary : 'transparent',
                color: idx === 0 ? '#fff' : `${colors.text}cc`,
              }}
            >
              {label}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b" style={{ borderColor: `${colors.text}10` }}>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>
            Welcome back!
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Leads', value: '1,234' },
              { label: 'Active Deals', value: '89' },
              { label: 'Revenue', value: '$125K' },
              { label: 'Conversion', value: '24%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg border shadow-sm"
                style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
              >
                <p className="text-xs mb-1" style={{ color: `${colors.text}99` }}>
                  {stat.label}
                </p>
                <p className="text-xl font-bold" style={{ color: colors.text }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderERPPreview(
  projectName: string,
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  },
) {
  return (
    <div className="h-full flex" style={{ backgroundColor: colors.background }}>
      <div
        className="w-48 border-r"
        style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
      >
        <div className="px-4 py-4 border-b" style={{ borderColor: `${colors.text}10` }}>
          <span className="font-bold text-sm" style={{ color: colors.text }}>
            {projectName || 'ERP Suite'}
          </span>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {['Dashboard', 'Orders', 'Inventory', 'Suppliers', 'Billing'].map((label, idx) => (
            <div
              key={label}
              className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: idx === 0 ? colors.primary : 'transparent',
                color: idx === 0 ? '#fff' : `${colors.text}cc`,
              }}
            >
              {label}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b" style={{ borderColor: `${colors.text}10` }}>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>
            Enterprise Dashboard
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Orders', value: '2,456' },
              { label: 'Inventory Items', value: '18.2K' },
              { label: 'Suppliers', value: '234' },
              { label: 'Revenue', value: '$892K' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg border shadow-sm"
                style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
              >
                <p className="text-xs mb-1" style={{ color: `${colors.text}99` }}>
                  {stat.label}
                </p>
                <p className="text-xl font-bold" style={{ color: colors.text }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMobileAppPreview(
  projectName: string,
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  },
) {
  return (
    <div
      className="h-full flex items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="rounded-[40px] border-8 overflow-hidden shadow-2xl w-72"
        style={{ borderColor: '#1a1a1a' }}
      >
        <div
          className="px-4 py-2 pt-8 text-center text-xs text-white font-medium"
          style={{ backgroundColor: colors.primary }}
        >
          9:41
        </div>
        <div className="px-4 py-4" style={{ backgroundColor: colors.background }}>
          <h2 className="text-lg font-bold text-center mb-4" style={{ color: colors.text }}>
            {projectName || 'App Name'}
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['Chat', 'Stats', 'Pay', 'Users', 'Files', 'Chat'].slice(0, 6).map((label, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 rounded-xl border"
                style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
              >
                <div
                  className="w-10 h-10 rounded-xl mb-2"
                  style={{ backgroundColor: `${colors.primary}20` }}
                />
                <span className="text-[10px] font-medium" style={{ color: colors.text }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderSaaSPreview(
  projectName: string,
  selectedFeatures: string[],
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  },
) {
  return (
    <div className="h-full flex" style={{ backgroundColor: colors.background }}>
      <div
        className="w-48 border-r"
        style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
      >
        <div className="px-4 py-4 border-b" style={{ borderColor: `${colors.text}10` }}>
          <span className="font-bold text-sm" style={{ color: colors.text }}>
            {projectName || 'SaaS App'}
          </span>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {['Dashboard', 'Team', 'Projects', 'Analytics', 'Settings'].map((label, idx) => (
            <div
              key={label}
              className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: idx === 0 ? colors.primary : 'transparent',
                color: idx === 0 ? '#fff' : `${colors.text}cc`,
              }}
            >
              {label}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b" style={{ borderColor: `${colors.text}10` }}>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>
            Dashboard Overview
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Active Users', value: '8,234' },
              { label: 'Projects', value: '1,456' },
              { label: 'Revenue', value: '$45.2K' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl border shadow-sm"
                style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
              >
                <p className="text-xs mb-1" style={{ color: `${colors.text}99` }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {selectedFeatures.slice(0, 4).map((feature, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: colors.surface, borderColor: `${colors.text}10` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  />
                  <span className="text-sm font-semibold" style={{ color: colors.text }}>
                    {feature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPreview(
  applicationType: ApplicationType,
  projectName: string,
  selectedFeatures: string[],
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  },
) {
  switch (applicationType) {
    case 'Website':
      return renderWebsitePreview(projectName, selectedFeatures, colors);
    case 'CRM':
      return renderCRMPreview(projectName, colors);
    case 'ERP':
      return renderERPPreview(projectName, colors);
    case 'Mobile App':
      return renderMobileAppPreview(projectName, colors);
    case 'SaaS Platform':
      return renderSaaSPreview(projectName, selectedFeatures, colors);
    default:
      return renderWebsitePreview(projectName, selectedFeatures, colors);
  }
}

export function LivePreviewPanel() {
  const {
    projectName,
    applicationType,
    selectedFeatures,
    theme,
    previewDevice,
    showPreview,
    previewKey,
    isGenerating,
    hasGenerated,
    setPreviewDevice,
    refreshPreview,
    setShowPreview,
  } = useBuilderStore();

  if (!showPreview) return null;

  const colors = getEffectiveColors(theme);

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Live Preview</h3>
          <div className="flex items-center gap-1">
            {DEVICES.map((device) => (
              <button
                key={device.id}
                type="button"
                onClick={() => setPreviewDevice(device.id)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  previewDevice === device.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <device.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshPreview}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowPreview(false)}
          >
            <EyeOff className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {isGenerating && !hasGenerated && <PreviewSkeleton applicationType={applicationType} />}

        {(!isGenerating || hasGenerated) && (
          <div
            key={previewKey}
            className={cn(
              'h-full overflow-auto mx-auto transition-all duration-300',
              DEVICE_WIDTHS[previewDevice],
              previewDevice !== 'desktop' && 'border-x border-border shadow-xl',
            )}
          >
            <div className="h-full">
              {renderPreview(applicationType, projectName, selectedFeatures, colors)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

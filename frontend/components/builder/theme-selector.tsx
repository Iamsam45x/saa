'use client';

import React from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { cn } from '@/lib/utils';
import { THEMES, type ThemeType } from '@/types';
import { Check } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme } = useBuilderStore();

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">Theme Selection</label>
      <p className="text-xs text-muted-foreground mb-4">
        Choose the visual theme for your application
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {THEMES.map((t) => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id as ThemeType)}
              className={cn(
                'relative group p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/50',
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="mb-3 h-20 rounded-lg overflow-hidden border border-border shadow-inner">
                <div
                  className="h-full p-2 flex flex-col gap-1"
                  style={{ backgroundColor: t.colors.background }}
                >
                  <div
                    className="h-3 rounded flex items-center px-1"
                    style={{ backgroundColor: t.colors.surface }}
                  >
                    <div
                      className="w-4 h-1.5 rounded"
                      style={{ backgroundColor: t.colors.primary }}
                    />
                  </div>
                  <div className="flex-1 flex gap-1">
                    <div className="flex-1 rounded" style={{ backgroundColor: t.colors.surface }} />
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isSelected ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {t.name}
                </span>
              </div>

              <div className="flex justify-center gap-1 mt-2">
                {[t.colors.primary, t.colors.secondary, t.colors.accent].map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

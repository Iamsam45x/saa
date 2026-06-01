'use client';

import React, { useCallback } from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Paintbrush, Check } from 'lucide-react';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={`${label} color picker`}
          />
          <div
            className="w-9 h-9 rounded-lg border-2 border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: value }}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) onChange(val);
          }}
          className="h-9 font-mono text-xs flex-1"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function CustomColorPicker() {
  const { customColors, setCustomColors, applyCustomColors } = useBuilderStore();

  const handleApply = useCallback(() => {
    applyCustomColors();
  }, [applyCustomColors]);

  return (
    <div className="space-y-4 p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-2 mb-2">
        <Paintbrush className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Custom Brand Colors</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label="Primary"
          value={customColors.primary}
          onChange={(val) => setCustomColors({ primary: val })}
        />
        <ColorField
          label="Secondary"
          value={customColors.secondary}
          onChange={(val) => setCustomColors({ secondary: val })}
        />
        <ColorField
          label="Accent"
          value={customColors.accent}
          onChange={(val) => setCustomColors({ accent: val })}
        />
        <ColorField
          label="Background"
          value={customColors.background}
          onChange={(val) => setCustomColors({ background: val })}
        />
      </div>

      <Button variant="default" size="sm" className="w-full gap-2 h-9" onClick={handleApply}>
        <Check className="h-4 w-4" />
        Apply Preview
      </Button>
    </div>
  );
}

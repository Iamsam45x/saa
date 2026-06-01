'use client';

import React from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { FEATURES, type Feature } from '@/types';

const featureIcons: Record<string, string> = {
  'AI Chatbot': '🤖',
  'Analytics Dashboard': '📊',
  'Payment Gateway': '💳',
  Notifications: '🔔',
  'User Authentication': '🔐',
  'User Management': '👥',
  'Customer Management': '👤',
  'Lead Management': '🎯',
  'CRM Pipeline': '📈',
  'Product Catalog': '📦',
  'Inventory Management': '🏭',
  'Order Management': '🛒',
  'Billing & Invoicing': '📄',
  'Document Management': '📁',
  'Appointment Booking': '📅',
  'Calendar & Scheduling': '📆',
  'Task Management': '✓',
  'Project Management': '📋',
  'File Uploads': '⬆',
  'Email Integration': '✉',
  'Live Chat': '💬',
  'Reports & Analytics': '📉',
  'Multi-Language Support': '🌐',
  'API Integrations': '🔗',
};

export function FeatureSelector() {
  const { selectedFeatures, addFeature, removeFeature } = useBuilderStore();

  const toggleFeature = (feature: Feature) => {
    if (selectedFeatures.includes(feature)) {
      removeFeature(feature);
    } else {
      addFeature(feature);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">
        Feature Selection <span className="text-destructive">*</span>
      </label>
      <p className="text-xs text-muted-foreground mb-4">
        Select the features you want to include in your application
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature);
          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={cn(
                'group relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                'hover:shadow-md hover:scale-[1.02]',
                isSelected
                  ? 'bg-primary/10 border-primary shadow-sm'
                  : 'bg-card hover:bg-accent border-border',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded border transition-all',
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border bg-background',
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{featureIcons[feature] || '✦'}</span>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

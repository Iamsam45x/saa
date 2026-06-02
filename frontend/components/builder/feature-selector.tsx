'use client';

import React from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckSquare,
  ClipboardList,
  CreditCard,
  Files,
  GitBranch,
  Globe2,
  Lock,
  Mail,
  MessageCircle,
  MessageSquare,
  Package,
  Plug,
  Receipt,
  ShoppingCart,
  Target,
  UploadCloud,
  UserCog,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { FEATURES, type Feature } from '@/types';

const featureIcons: Record<string, LucideIcon> = {
  'AI Chatbot': Bot,
  'Analytics Dashboard': BarChart3,
  'Payment Gateway': CreditCard,
  'WhatsApp Integration': MessageCircle,
  Notifications: Bell,
  'User Authentication': Lock,
  'User Management': UserCog,
  'Customer Management': Users,
  'Lead Management': Target,
  'CRM Pipeline': GitBranch,
  'Product Catalog': Package,
  'Inventory Management': Warehouse,
  'Order Management': ShoppingCart,
  'Billing & Invoicing': Receipt,
  'Document Management': Files,
  'Appointment Booking': CalendarDays,
  'Calendar & Scheduling': CalendarDays,
  'Task Management': CheckSquare,
  'Project Management': ClipboardList,
  'File Uploads': UploadCloud,
  'Email Integration': Mail,
  'Live Chat': MessageSquare,
  'Reports & Analytics': BarChart3,
  'Multi Language Support': Globe2,
  'API Integrations': Plug,
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
          const Icon = featureIcons[feature] || CheckSquare;

          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={cn(
                'group relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                'hover:shadow-md hover:scale-[1.01]',
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
                  <Icon className="h-4 w-4 text-muted-foreground" />
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

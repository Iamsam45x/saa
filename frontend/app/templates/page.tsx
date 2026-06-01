'use client';

import React from 'react';
import {
  Layout,
  Shield,
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  Globe,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const templates = [
  {
    id: 1,
    name: 'Corporate Website',
    description: 'Professional business website with hero section, features, and contact form',
    type: 'Website',
    features: ['Hero Section', 'Feature Grid', 'Contact Form', 'About Page', 'Blog'],
    icon: Globe,
    gradient: 'from-blue-500 to-cyan-500',
    popular: true,
  },
  {
    id: 2,
    name: 'E-Commerce Store',
    description: 'Full-featured online store with product catalog and shopping cart',
    type: 'SaaS Platform',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Tracking', 'Reviews'],
    icon: ShoppingCart,
    gradient: 'from-cyan-500 to-teal-500',
    popular: true,
  },
  {
    id: 3,
    name: 'CRM Pipeline',
    description: 'Complete customer relationship management with lead tracking',
    type: 'CRM',
    features: [
      'Lead Management',
      'Pipeline View',
      'Contact Database',
      'Email Integration',
      'Reports',
    ],
    icon: Users,
    gradient: 'from-teal-500 to-emerald-500',
    popular: true,
  },
  {
    id: 4,
    name: 'Inventory Management',
    description: 'Enterprise-grade inventory tracking and management system',
    type: 'ERP',
    features: ['Stock Tracking', 'Supplier Management', 'Purchase Orders', 'Reports', 'Alerts'],
    icon: BarChart3,
    gradient: 'from-emerald-500 to-green-500',
    popular: false,
  },
  {
    id: 5,
    name: 'Mobile App MVP',
    description: 'Cross-platform mobile application with essential features',
    type: 'Mobile App',
    features: ['User Auth', 'Push Notifications', 'Offline Mode', 'Profile', 'Settings'],
    icon: Zap,
    gradient: 'from-orange-500 to-amber-500',
    popular: false,
  },
  {
    id: 6,
    name: 'Analytics Dashboard',
    description: 'Data visualization and analytics reporting platform',
    type: 'SaaS Platform',
    features: ['Charts', 'Real-time Data', 'Custom Reports', 'Export', 'Dashboards'],
    icon: TrendingUp,
    gradient: 'from-purple-500 to-pink-500',
    popular: false,
  },
  {
    id: 7,
    name: 'Project Management',
    description: 'Team collaboration and project tracking platform',
    type: 'SaaS Platform',
    features: ['Task Boards', 'Team Chat', 'File Sharing', 'Timeline', 'Calendar'],
    icon: FileText,
    gradient: 'from-rose-500 to-red-500',
    popular: false,
  },
  {
    id: 8,
    name: 'Client Portal',
    description: 'Secure client access portal with document sharing',
    type: 'Website',
    features: ['Secure Login', 'Document Sharing', 'Messaging', 'Activity Log', 'Notifications'],
    icon: Shield,
    gradient: 'from-indigo-500 to-purple-500',
    popular: false,
  },
];

export default function TemplatesPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg">
              <Layout className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Templates</h1>
              <p className="text-sm text-muted-foreground">
                Pre-configured project blueprints to jumpstart your work
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant="default" size="sm" className="h-9">
            All Templates
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            Website
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            CRM
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            ERP
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            Mobile App
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            SaaS Platform
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group rounded-xl border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Template Preview */}
              <div className="relative h-40 bg-gradient-to-br bg-muted flex flex-col items-center justify-center gap-2">
                <div
                  className={cn(
                    'flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform',
                    template.gradient,
                  )}
                >
                  <template.icon className="h-7 w-7 text-white" />
                </div>
                {template.popular && (
                  <Badge className="absolute top-3 right-3" variant="default">
                    Popular
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use Template
                </Button>
              </div>

              {/* Template Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <Badge variant="outline" className="text-xs mb-3">
                  {template.type}
                </Badge>

                <div className="flex flex-wrap gap-1 mb-3">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      +{template.features.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {template.features.length} features included
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

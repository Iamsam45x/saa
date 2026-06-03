'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilderStore } from '@/store/builder-store';
import { useAuth, getAccessToken } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FeatureSelector } from '@/components/builder/feature-selector';
import { ThemeSelector } from '@/components/builder/theme-selector';
import { CustomColorPicker } from '@/components/builder/custom-color-picker';
import { AIControls } from '@/components/builder/ai-controls';
import { LivePreviewPanel } from '@/components/preview/live-preview-panel';
import { Sparkles, RotateCcw, Eye, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ApplicationType, Feature, ThemeType } from '@/types';

const TEMPLATES_MAP: Record<
  string,
  {
    projectName: string;
    description: string;
    targetAudience: string;
    applicationType: ApplicationType;
    selectedFeatures: Feature[];
    theme: ThemeType;
  }
> = {
  'corporate-website': {
    projectName: 'Corporate Website',
    description: 'Professional business website with hero section, features, and contact form',
    targetAudience: 'Business professionals and corporate clients',
    applicationType: 'Website',
    selectedFeatures: ['User Authentication', 'Analytics Dashboard', 'Notifications', 'Live Chat'],
    theme: 'corporate-blue',
  },
  'e-commerce-store': {
    projectName: 'E-Commerce Store',
    description: 'Full-featured online store with product catalog and shopping cart',
    targetAudience: 'Online shoppers and retail customers',
    applicationType: 'SaaS Platform',
    selectedFeatures: [
      'Product Catalog',
      'Payment Gateway',
      'Order Management',
      'Billing & Invoicing',
      'Notifications',
    ],
    theme: 'dark-mode',
  },
  'crm-pipeline': {
    projectName: 'CRM Pipeline',
    description: 'Complete customer relationship management with lead tracking',
    targetAudience: 'Sales teams and customer service representatives',
    applicationType: 'CRM',
    selectedFeatures: [
      'Customer Management',
      'Lead Management',
      'CRM Pipeline',
      'Analytics Dashboard',
      'Email Integration',
    ],
    theme: 'minimal-white',
  },
  'inventory-management': {
    projectName: 'Inventory Management',
    description: 'Enterprise-grade inventory tracking and management system',
    targetAudience: 'Warehouse managers and logistics coordinators',
    applicationType: 'ERP',
    selectedFeatures: [
      'Inventory Management',
      'Order Management',
      'Billing & Invoicing',
      'Reports & Analytics',
      'Notifications',
    ],
    theme: 'neon-gradient',
  },
  'mobile-app-mvp': {
    projectName: 'Mobile App MVP',
    description: 'Cross-platform mobile application with essential features',
    targetAudience: 'Mobile-first users and startup customers',
    applicationType: 'Mobile App',
    selectedFeatures: [
      'User Authentication',
      'Notifications',
      'File Uploads',
      'Live Chat',
      'Analytics Dashboard',
    ],
    theme: 'custom-brand',
  },
  'analytics-dashboard': {
    projectName: 'Analytics Dashboard',
    description: 'Data visualization and analytics reporting platform',
    targetAudience: 'Data analysts and business executives',
    applicationType: 'SaaS Platform',
    selectedFeatures: [
      'Analytics Dashboard',
      'Reports & Analytics',
      'User Management',
      'Notifications',
      'API Integrations',
    ],
    theme: 'dark-mode',
  },
  'project-management': {
    projectName: 'Project Management',
    description: 'Team collaboration and project tracking platform',
    targetAudience: 'Project managers and team leads',
    applicationType: 'SaaS Platform',
    selectedFeatures: [
      'Project Management',
      'Task Management',
      'Calendar & Scheduling',
      'File Uploads',
      'Notifications',
    ],
    theme: 'corporate-blue',
  },
  'client-portal': {
    projectName: 'Client Portal',
    description: 'Secure client access portal with document sharing',
    targetAudience: 'Clients and external stakeholders',
    applicationType: 'Website',
    selectedFeatures: [
      'User Authentication',
      'Document Management',
      'File Uploads',
      'Notifications',
      'Live Chat',
    ],
    theme: 'minimal-white',
  },
};

export function ProjectBuilder() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const {
    projectName,
    description,
    targetAudience,
    location,
    applicationType,
    theme,
    showPreview,
    saveStatus,
    saveError,
    setProjectName,
    setDescription,
    setTargetAudience,
    setLocation,
    setApplicationType,
    resetForm,
    setShowPreview,
    saveProject,
    loadProject,
    validateForm,
    missingFields,
  } = useBuilderStore();

  useEffect(() => {
    const template = searchParams.get('template');
    const projectId = searchParams.get('projectId');

    if (template && TEMPLATES_MAP[template]) {
      loadProject(TEMPLATES_MAP[template]);
    } else if (projectId) {
      (async () => {
        try {
          const token = await getAccessToken();
          if (!token) return;
          const res = await fetch(`/api/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const project = await res.json();
            loadProject({
              projectName: project.name,
              description: project.description,
              targetAudience: project.target_audience,
              location: project.location,
              applicationType: project.application_type,
              selectedFeatures: project.features || [],
              theme: project.theme,
              customColors: project.custom_colors,
            });
          }
        } catch {
          toast.error('Failed to load project');
        }
      })();
    }
  }, [searchParams, loadProject]);

  async function handleSave() {
    const missing = validateForm();
    if (missing.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    await saveProject();
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Column - Form */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="px-6 lg:px-8 py-6 max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Project Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Configure your software solution in minutes
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-primary" />
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="projectName" className="text-sm font-semibold">
                    Project Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="Enter your project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Business Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your business and what it does..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="targetAudience" className="text-sm font-semibold">
                      Target Audience <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="targetAudience"
                      placeholder="Who is your target audience?"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location" className="text-sm font-semibold">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="Business location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Application Type</Label>
                  <Select
                    value={applicationType}
                    onValueChange={(value) => setApplicationType(value as ApplicationType)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="CRM">CRM</SelectItem>
                      <SelectItem value="ERP">ERP</SelectItem>
                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                      <SelectItem value="SaaS Platform">SaaS Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-primary" />
                <h2 className="text-lg font-semibold">Feature Configuration</h2>
              </div>
              <FeatureSelector />
            </div>

            {/* Theme & Design Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-primary" />
                <h2 className="text-lg font-semibold">Theme & Design</h2>
              </div>

              <ThemeSelector />

              {theme === 'custom-brand' && <CustomColorPicker />}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button variant="outline" className="flex-1 h-11 gap-2" onClick={resetForm}>
                <RotateCcw className="h-4 w-4" />
                Reset Form
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11 gap-2 lg:hidden"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                className={
                  saveStatus === 'saving'
                    ? 'h-11 gap-2 cursor-not-allowed'
                    : 'h-11 gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600'
                }
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saveStatus === 'saved' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
              </Button>
            </div>
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{saveError || 'Failed to save project'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Column - AI Controls */}
      <div className="w-80 shrink-0 border-l border-border bg-card overflow-y-auto hidden lg:block">
        <div className="p-4 space-y-4">
          <AIControls />
        </div>
      </div>

      {/* Right Column - Live Preview */}
      {showPreview && (
        <div className="w-[500px] shrink-0 border-l border-border hidden lg:flex lg:flex-col">
          <LivePreviewPanel />
        </div>
      )}

      {/* Mobile/Tablet Preview Toggle */}
      {!showPreview && (
        <div className="lg:hidden fixed bottom-6 right-6 z-10">
          <Button className="shadow-lg gap-2" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      )}
    </div>
  );
}

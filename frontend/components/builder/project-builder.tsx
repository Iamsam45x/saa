'use client';

import React from 'react';
import { useBuilderStore } from '@/store/builder-store';
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
import { Sparkles, RotateCcw, Eye } from 'lucide-react';
import type { ApplicationType } from '@/types';

export function ProjectBuilder() {
  const {
    projectName,
    description,
    targetAudience,
    location,
    applicationType,
    theme,
    showPreview,
    setProjectName,
    setDescription,
    setTargetAudience,
    setLocation,
    setApplicationType,
    resetForm,
    setShowPreview,
  } = useBuilderStore();

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
            </div>
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

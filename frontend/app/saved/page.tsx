'use client';

import React from 'react';
import { Folder, Search, Filter, MoreVertical, Clock, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const savedProjects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Full-featured online store with payment integration',
    type: 'SaaS Platform',
    features: 12,
    lastEdited: '2 hours ago',
    status: 'In Progress',
    theme: 'dark-mode',
  },
  {
    id: 2,
    name: 'Client CRM System',
    description: 'Comprehensive customer relationship management',
    type: 'CRM',
    features: 18,
    lastEdited: '1 day ago',
    status: 'Completed',
    theme: 'corporate-blue',
  },
  {
    id: 3,
    name: 'Inventory Manager',
    description: 'Enterprise resource planning for inventory',
    type: 'ERP',
    features: 15,
    lastEdited: '3 days ago',
    status: 'Draft',
    theme: 'minimal-white',
  },
  {
    id: 4,
    name: 'Marketing Website',
    description: 'Company landing page with contact form',
    type: 'Website',
    features: 8,
    lastEdited: '1 week ago',
    status: 'Completed',
    theme: 'neon-gradient',
  },
  {
    id: 5,
    name: 'Mobile App Configuration',
    description: 'Cross-platform mobile application',
    type: 'Mobile App',
    features: 14,
    lastEdited: '2 weeks ago',
    status: 'Draft',
    theme: 'custom-brand',
  },
];

export default function SavedProjectsPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Folder className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Saved Projects</h1>
              <p className="text-sm text-muted-foreground">
                Manage and access your configured projects
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10 h-11" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-11 w-11">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-11 gap-2">
              All Types
            </Button>
            <Button variant="outline" className="h-11 gap-2">
              All Status
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Project Header */}
              <div className="relative h-32 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/50 backdrop-blur-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {project.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.theme}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span>{project.features} features</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{project.lastEdited}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      project.status === 'Completed'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : project.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
                    )}
                  >
                    {project.status}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - only shown if no projects */}
        <div className="hidden flex-col items-center justify-center py-16">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted mb-4">
            <Folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first project to get started
          </p>
        </div>
      </div>
    </div>
  );
}

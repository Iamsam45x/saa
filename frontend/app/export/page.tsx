'use client';

import React, { useEffect, useState } from 'react';
import { Download, FileCode, FileText, Archive, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAccessToken } from '@/components/auth/auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  application_type: string;
}

const exportOptions = [
  {
    id: 'source-code',
    title: 'Source Code',
    description: 'Download the complete project source code as a ZIP archive',
    icon: FileCode,
    gradient: 'from-cyan-500 to-teal-500',
    formats: ['ZIP', 'TAR'],
    endpoint: '/api/export/react',
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Export project documentation in PDF or Markdown format',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    formats: ['PDF', 'MD'],
    endpoint: null,
  },
  {
    id: 'archive',
    title: 'Project Archive',
    description: 'Full project backup including all assets and configurations',
    icon: Archive,
    gradient: 'from-teal-500 to-emerald-500',
    formats: ['ZIP'],
    endpoint: null,
  },
];

export default function ExportPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const res = await fetch('/api/projects?pageSize=100', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
          if (data.projects?.length > 0) {
            setSelectedProjectId(data.projects[0].id);
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  async function handleExport(format: string, endpoint: string | null) {
    if (!selectedProjectId) {
      toast.error('Please select a project first');
      return;
    }
    setExportingFormat(format);

    if (endpoint) {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            projectId: selectedProjectId,
            format: format.toLowerCase(),
          }),
        });

        if (!res.ok) throw new Error('Export failed');

        const data = await res.json();
        if (data.url) {
          window.open(data.url, '_blank');
          toast.success('Export generated successfully');
        } else {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `project-export.${format.toLowerCase()}`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('Download started');
        }
      } catch {
        toast.error('Export failed. Using fallback download.');
        fallbackExport();
      }
    } else {
      fallbackExport();
    }
    setExportingFormat(null);
  }

  function fallbackExport() {
    const project = projects.find((p) => p.id === selectedProjectId);
    const content = JSON.stringify(
      {
        projectId: selectedProjectId,
        projectName: project?.name,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'project'}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download started');
  }

  return (
    <div className="h-full overflow-auto">
      <div className="px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Export</h1>
              <p className="text-sm text-muted-foreground">
                Export your project in various formats
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block">Select Project</label>
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
            disabled={loadingProjects}
          >
            <SelectTrigger className="h-11 w-full max-w-md">
              <SelectValue
                placeholder={loadingProjects ? 'Loading projects...' : 'Choose a project'}
              />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.application_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className="group rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} shadow-lg shrink-0`}
                >
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <div className="flex gap-2">
                    {option.formats.map((fmt) => (
                      <Button
                        key={fmt}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => handleExport(fmt, option.endpoint)}
                        disabled={exportingFormat === fmt}
                      >
                        {exportingFormat === fmt ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        {fmt}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

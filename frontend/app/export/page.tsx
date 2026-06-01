'use client';

import React from 'react';
import { Download, FileCode, FileText, Archive, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const exportOptions = [
  {
    title: 'Source Code',
    description: 'Download the complete project source code as a ZIP archive',
    icon: FileCode,
    gradient: 'from-cyan-500 to-teal-500',
    formats: ['ZIP', 'TAR'],
  },
  {
    title: 'Documentation',
    description: 'Export project documentation in PDF or Markdown format',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    formats: ['PDF', 'MD'],
  },
  {
    title: 'Project Archive',
    description: 'Full project backup including all assets and configurations',
    icon: Archive,
    gradient: 'from-teal-500 to-emerald-500',
    formats: ['ZIP'],
  },
];

export default function ExportPage() {
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

        <div className="space-y-4">
          {exportOptions.map((option) => (
            <div
              key={option.title}
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
                      <Button key={fmt} variant="outline" size="sm" className="h-8 text-xs gap-1">
                        <Download className="h-3 w-3" />
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

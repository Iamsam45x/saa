'use client';

import React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Folder,
  Layout,
  Users,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const stats = [
  {
    label: 'Total Projects',
    value: '24',
    change: '+3',
    icon: Folder,
    color: 'from-cyan-500 to-teal-500',
  },
  {
    label: 'Active Templates',
    value: '12',
    change: '+2',
    icon: Layout,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Team Members',
    value: '6',
    change: '+1',
    icon: Users,
    color: 'from-teal-500 to-emerald-500',
  },
];

const recentProjects = [
  {
    name: 'E-Commerce Platform',
    type: 'SaaS Platform',
    lastEdited: '2 hours ago',
    features: 12,
    status: 'In Progress',
  },
  {
    name: 'Client CRM System',
    type: 'CRM',
    lastEdited: '1 day ago',
    features: 18,
    status: 'Completed',
  },
  {
    name: 'Inventory Manager',
    type: 'ERP',
    lastEdited: '3 days ago',
    features: 15,
    status: 'Draft',
  },
  {
    name: 'Marketing Website',
    type: 'Website',
    lastEdited: '1 week ago',
    features: 8,
    status: 'Completed',
  },
];

function getStatusClass(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';
    case 'In Progress':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
  }
}

export default function DashboardPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back!</h1>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your projects
              </p>
            </div>
            <Link href="/builder">
              <Button
                size="lg"
                className="h-11 gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg"
              >
                <PlusCircle className="h-5 w-5" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <stat.icon className="w-full h-full" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg',
                      stat.color,
                    )}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: '/builder',
                label: 'Create New',
                desc: 'Start a new project',
                icon: PlusCircle,
                gradient: 'from-cyan-500 to-teal-500',
              },
              {
                href: '/saved',
                label: 'View Projects',
                desc: 'Access saved work',
                icon: Folder,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                href: '/templates',
                label: 'Templates',
                desc: 'Pre-made starters',
                icon: Layout,
                gradient: 'from-teal-500 to-emerald-500',
              },
              {
                href: '/settings',
                label: 'Settings',
                desc: 'Configure preferences',
                icon: Sparkles,
                gradient: 'from-emerald-500 to-green-500',
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-200"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} shadow-md group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Projects</h2>
            <Link href="/saved" className="text-sm text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {['Project', 'Type', 'Features', 'Last Edited', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentProjects.map((project) => (
                    <tr
                      key={project.name}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-foreground">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{project.type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BarChart3 className="h-4 w-4" />
                          {project.features} features
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {project.lastEdited}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            getStatusClass(project.status),
                          )}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

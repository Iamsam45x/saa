'use client';

import React from 'react';
import { Settings, User, Bell, Palette, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const settingSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Configure your notification preferences',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Palette,
    description: 'Customize the look and feel',
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    description: 'Manage your account security',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: HelpCircle,
    description: 'Get help and contact support',
  },
];

export default function SettingsPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {settingSections.map((section, idx) => (
                <button
                  key={section.id}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    idx === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Profile Section */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Profile Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" className="h-11" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      className="h-11"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Company Inc." className="h-11" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notification Preferences</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Email notifications',
                    description: 'Receive email updates about your projects',
                  },
                  {
                    label: 'Push notifications',
                    description: 'Browser notifications for important updates',
                  },
                  { label: 'Weekly digest', description: 'Summary of your weekly activity' },
                  { label: 'Marketing emails', description: 'Product updates and announcements' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={idx < 2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance Section */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Appearance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme across the application
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Reduce spacing for denser information
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Animations</p>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Security Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

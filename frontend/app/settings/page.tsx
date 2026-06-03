'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Settings,
  User,
  Bell,
  Palette,
  Shield,
  HelpCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-context';
import { toast } from 'sonner';

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
  { id: 'security', title: 'Security', icon: Shield, description: 'Manage your account security' },
  {
    id: 'help',
    title: 'Help & Support',
    icon: HelpCircle,
    description: 'Get help and contact support',
  },
];

export default function SettingsPage() {
  const { user, supabase } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    marketing: false,
  });

  const [appearance, setAppearance] = useState({
    darkMode: theme === 'dark',
    compactMode: false,
    animations: true,
  });

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setCompany(user.user_metadata?.company_name || '');
    }
  }, [user]);

  useEffect(() => {
    setAppearance((prev) => ({ ...prev, darkMode: theme === 'dark' }));
  }, [theme]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, company_name: company },
      });
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  function handleDarkModeToggle(checked: boolean) {
    setAppearance((prev) => ({ ...prev, darkMode: checked }));
    setTheme(checked ? 'dark' : 'light');
  }

  function handleNotificationChange(key: keyof typeof notifications, checked: boolean) {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
    toast.success(
      `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}`,
    );
  }

  function handleAppearanceChange(key: keyof typeof appearance, checked: boolean) {
    setAppearance((prev) => ({ ...prev, [key]: checked }));
    if (key === 'animations') {
      document.documentElement.style.setProperty(
        '--disable-animations',
        checked ? 'none' : 'initial',
      );
    }
    toast.success(
      `${key === 'compactMode' ? 'Compact Mode' : key === 'animations' ? 'Animations' : 'Dark Mode'} ${checked ? 'enabled' : 'disabled'}`,
    );
  }

  function handleEnable2FA() {
    toast.info('Two-factor authentication setup coming soon');
  }

  function handleChangePassword() {
    toast.info('Redirecting to password reset...');
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });
  }

  return (
    <div className="h-full overflow-auto">
      <div className="px-6 lg:px-8 py-6 max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    activeSection === section.id
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

          <div className="md:col-span-3 space-y-8">
            {activeSection === 'profile' && (
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Profile Settings</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="h-11"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        className="h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Company Inc."
                        className="h-11"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 gap-2"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Notification Preferences</h2>
                </div>
                <div className="space-y-4">
                  {(
                    [
                      {
                        key: 'email',
                        label: 'Email notifications',
                        description: 'Receive email updates about your projects',
                      },
                      {
                        key: 'push',
                        label: 'Push notifications',
                        description: 'Browser notifications for important updates',
                      },
                      {
                        key: 'weekly',
                        label: 'Weekly digest',
                        description: 'Summary of your weekly activity',
                      },
                      {
                        key: 'marketing',
                        label: 'Marketing emails',
                        description: 'Product updates and announcements',
                      },
                    ] as const
                  ).map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
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
                    <Switch checked={appearance.darkMode} onCheckedChange={handleDarkModeToggle} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing for denser information
                      </p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Animations</p>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={appearance.animations}
                      onCheckedChange={(checked) => handleAppearanceChange('animations', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Security Settings</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleEnable2FA}>
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleChangePassword}>
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'help' && (
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Help & Support</h2>
                </div>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>Need help with the application? Here are some resources:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Check the documentation for detailed guides</li>
                    <li>Contact support at support@spassociates.com</li>
                    <li>Visit our knowledge base for FAQs</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

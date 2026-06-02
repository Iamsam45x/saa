import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AuthProvider } from '@/components/auth/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SP Associates - AI Software Solution Configurator',
  description: 'Internal tool for generating business-specific software concepts and UI previews',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex h-screen overflow-hidden bg-background">
              <AppSidebar />
              <main className="flex-1 overflow-hidden lg:pl-72">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

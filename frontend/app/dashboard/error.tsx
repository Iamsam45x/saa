'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || 'Failed to load the dashboard.'}
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    </div>
  );
}

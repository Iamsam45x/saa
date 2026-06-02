import { Loader2 } from 'lucide-react';

export default function TemplatesLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading templates...</p>
      </div>
    </div>
  );
}

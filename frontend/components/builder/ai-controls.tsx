'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Loader2,
  RotateCcw,
  Undo2,
  Clock,
  Brain,
  Layers,
  FileJson,
  Eye,
  AlertCircle,
  CheckCircle2,
  History,
  ChevronRight,
  Zap,
} from 'lucide-react';

const VARIATIONS = [
  { value: 'layout', label: 'Try different layout' },
  { value: 'modern', label: 'More modern' },
  { value: 'conservative', label: 'More conservative' },
];

const STEP_ICONS: Record<string, React.ReactNode> = {
  analyzing: <Brain className="h-4 w-4" />,
  selecting: <Layers className="h-4 w-4" />,
  generating: <FileJson className="h-4 w-4" />,
  rendering: <Eye className="h-4 w-4" />,
};

function GenerateButton() {
  const { isGenerating, hasGenerated, missingFields, generateSchema, validateForm } =
    useBuilderStore();

  const isDisabled = isGenerating;

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className={cn(
          'w-full h-12 text-base font-semibold gap-2 transition-all duration-300',
          isGenerating
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : hasGenerated
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg'
              : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg',
        )}
        disabled={isDisabled}
        onClick={generateSchema}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : hasGenerated ? (
          <>
            <CheckCircle2 className="h-5 w-5" />
            Schema Generated
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate UI Schema
          </>
        )}
      </Button>

      {missingFields.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium mb-1">Missing required fields:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function AIStatusPanel() {
  const {
    isGenerating,
    generationStep,
    generationStepLabel,
    tokenUsage,
    processingTime,
    hasGenerated,
  } = useBuilderStore();

  if (!isGenerating && !hasGenerated) return null;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Brain className="h-4 w-4 text-primary" />
        AI Status
      </div>

      {isGenerating && (
        <div className="space-y-2">
          {(['analyzing', 'selecting', 'generating', 'rendering'] as const).map((step) => {
            const steps = ['analyzing', 'selecting', 'generating', 'rendering'] as const;
            const isActive = generationStep === step;
            const isPast =
              steps.indexOf(step) < steps.indexOf(generationStep as (typeof steps)[number]);

            return (
              <div
                key={step}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-300',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : isPast
                      ? 'text-muted-foreground/60'
                      : 'text-muted-foreground/40',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : isPast
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-muted/50 text-muted-foreground/40',
                  )}
                >
                  {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : STEP_ICONS[step]}
                </div>
                <span>{generationStepLabel || step}</span>
              </div>
            );
          })}
        </div>
      )}

      {hasGenerated && !isGenerating && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Generation complete
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span>{tokenUsage} tokens</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{(processingTime / 1000).toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
}

function RegenerationControls() {
  const { hasGenerated, isGenerating, selectedVariation, regenerate } = useBuilderStore();

  if (!hasGenerated) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select
          value={selectedVariation}
          onValueChange={(val) => regenerate(val)}
          disabled={isGenerating}
        >
          <SelectTrigger className="flex-1 h-9 text-xs">
            <SelectValue placeholder="Variations" />
          </SelectTrigger>
          <SelectContent>
            {VARIATIONS.map((v) => (
              <SelectItem key={v.value} value={v.value} className="text-xs">
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => regenerate(selectedVariation || 'layout')}
          disabled={isGenerating}
        >
          <RotateCcw className={cn('h-4 w-4', isGenerating && 'animate-spin')} />
        </Button>
      </div>
    </div>
  );
}

function ActionHistory() {
  const { actionHistory, undo } = useBuilderStore();

  if (actionHistory.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <History className="h-4 w-4 text-primary" />
          Action History
        </div>
        {actionHistory.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            onClick={undo}
          >
            <Undo2 className="h-3 w-3" />
            Undo
          </Button>
        )}
      </div>

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {[...actionHistory].reverse().map((action, idx) => (
          <button
            key={action.id}
            type="button"
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left',
              idx === 0
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted/50',
            )}
            onClick={() => {
              if (idx === 0) undo();
            }}
          >
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="flex-1 truncate">{action.description}</span>
            <span className="text-[10px] text-muted-foreground/60 shrink-0">
              {formatTimeAgo(action.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function AIControls() {
  return (
    <div className="space-y-4">
      <GenerateButton />
      <AIStatusPanel />
      <RegenerationControls />
      <ActionHistory />
    </div>
  );
}

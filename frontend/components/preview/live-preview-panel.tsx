'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useBuilderStore, type GeneratedFile } from '@/store/builder-store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Eye,
  EyeOff,
  Code2,
  EyeIcon,
  Loader2,
  Sparkles,
  FileIcon,
  FolderIcon,
  ChevronRight,
  ChevronDown,
  Maximize2,
  X,
} from 'lucide-react';
import { renderSchemaPreview } from '@/components/preview/section-renderers';

const DEVICES = [
  { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
  { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
  { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
];

const DEVICE_WIDTHS: Record<string, string> = {
  desktop: 'w-full',
  tablet: 'w-[768px]',
  mobile: 'w-[375px]',
};

function PreviewSkeleton() {
  return (
    <div className="h-full flex flex-col p-4 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-12" />
          ))}
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">No preview yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Fill in your project details and generate a schema to see a live preview.
        </p>
      </div>
    </div>
  );
}

function groupByDir(files: GeneratedFile[]): Map<string, GeneratedFile[]> {
  const dirs = new Map<string, GeneratedFile[]>();
  for (const f of files) {
    const parts = f.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '.';
    if (!dirs.has(dir)) dirs.set(dir, []);
    dirs.get(dir)!.push(f);
  }
  return dirs;
}

function FileTree({
  files,
  selectedIndex,
  onSelect,
}: {
  files: GeneratedFile[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const dirs = groupByDir(files);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const sortedDirs = Array.from(dirs.entries()).sort(([a], [b]) => {
    if (a === '.') return -1;
    if (b === '.') return 1;
    return a.localeCompare(b);
  });

  let flatIndex = 0;

  return (
    <div className="h-full overflow-y-auto bg-[#252526] border-r border-[#3c3c3c] w-52 shrink-0">
      <div className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        Explorer
      </div>
      {sortedDirs.map(([dir, dirFiles]) => {
        const isCollapsed = collapsed.has(dir);
        return (
          <div key={dir}>
            <button
              type="button"
              onClick={() => {
                const next = new Set(collapsed);
                if (isCollapsed) next.delete(dir);
                else next.add(dir);
                setCollapsed(next);
              }}
              className="w-full flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-[#2a2d2e]"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3 shrink-0" />
              ) : (
                <ChevronDown className="h-3 w-3 shrink-0" />
              )}
              <FolderIcon className="h-3 w-3 shrink-0 text-blue-400" />
              <span className="truncate">{dir === '.' ? 'root' : dir}</span>
            </button>
            {!isCollapsed &&
              dirFiles.map((f) => {
                const idx = flatIndex;
                flatIndex += 1;
                return (
                  <button
                    key={f.path}
                    type="button"
                    onClick={() => onSelect(idx)}
                    className={cn(
                      'w-full flex items-center gap-1.5 pl-6 pr-2 py-1 text-xs transition-colors text-left',
                      idx === selectedIndex
                        ? 'bg-[#37373d] text-white'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2d2e]',
                    )}
                  >
                    <FileIcon className="h-3 w-3 shrink-0 text-gray-500" />
                    <span className="truncate">{f.path.split('/').pop()}</span>
                  </button>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

function CodePreview({ files }: { files: GeneratedFile[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = files[selectedIndex] || files[0];

  return (
    <div className="h-full flex bg-[#1e1e1e]">
      <FileTree files={files} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#404040] shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto">
            {files.slice(0, 15).map((f, i) => (
              <button
                key={f.path}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  'px-3 py-1 text-xs font-mono rounded-t transition-colors whitespace-nowrap',
                  i === selectedIndex
                    ? 'bg-[#1e1e1e] text-white border-t border-[#404040]'
                    : 'text-gray-500 hover:text-gray-300',
                )}
              >
                {f.path.split('/').pop()}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500 shrink-0 ml-2">
            {current.content.length.toLocaleString()} bytes
          </span>
        </div>
        <pre className="flex-1 p-4 text-xs leading-relaxed font-mono text-[#d4d4d4] overflow-auto">
          <code>{current.content}</code>
        </pre>
      </div>
    </div>
  );
}

function IframePreview({ html, deviceWidth }: { html: string; deviceWidth: string }) {
  return (
    <div className="h-full overflow-hidden bg-gray-100 flex items-start justify-center">
      <div className={cn('h-full overflow-auto transition-all duration-300 bg-white', deviceWidth)}>
        <iframe
          srcDoc={html}
          className="w-full h-full border-0"
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

function FullScreenPreview({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    previewDevice,
    previewKey,
    isGenerating,
    hasGenerated,
    generatedSchema,
    previewHtml,
    generatedFiles,
    isCodeGenerating,
    showCode,
    setPreviewDevice,
    refreshPreview,
    setShowCode,
  } = useBuilderStore();

  if (!open) return null;

  const hasCode = generatedFiles.length > 0 && previewHtml;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Live Preview</h3>
          <div className="flex items-center gap-1">
            {DEVICES.map((device) => (
              <button
                key={device.id}
                type="button"
                aria-label={device.label}
                onClick={() => setPreviewDevice(device.id)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  previewDevice === device.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <device.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasCode && (
            <div className="flex items-center border rounded-md overflow-hidden mr-1">
              <button
                type="button"
                onClick={() => setShowCode(false)}
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors',
                  !showCode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <EyeIcon className="h-3 w-3" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => setShowCode(true)}
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors',
                  showCode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Code2 className="h-3 w-3" />
                Code
              </button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshPreview}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {isGenerating && !hasGenerated && <PreviewSkeleton />}

        {isCodeGenerating && !showCode && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating live preview...
            </div>
          </div>
        )}

        {(!isGenerating || hasGenerated) && (
          <>
            {hasCode && showCode ? (
              <CodePreview files={generatedFiles} />
            ) : hasCode && !showCode ? (
              <IframePreview html={previewHtml!} deviceWidth={DEVICE_WIDTHS[previewDevice]} />
            ) : generatedSchema ? (
              <div
                key={previewKey}
                className={cn(
                  'h-full overflow-auto mx-auto transition-all duration-300',
                  DEVICE_WIDTHS[previewDevice],
                  previewDevice !== 'desktop' && 'border-x border-border shadow-xl',
                )}
              >
                <div className="h-full">{renderSchemaPreview(generatedSchema)}</div>
              </div>
            ) : (
              <EmptyPreview />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function LivePreviewPanel() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    previewDevice,
    showPreview,
    previewKey,
    isGenerating,
    hasGenerated,
    generatedSchema,
    previewHtml,
    generatedFiles,
    isCodeGenerating,
    showCode,
    setPreviewDevice,
    refreshPreview,
    setShowPreview,
    setShowCode,
  } = useBuilderStore();

  if (!showPreview) return null;

  const hasCode = generatedFiles.length > 0 && previewHtml;

  return (
    <>
      <FullScreenPreview open={isFullScreen} onClose={() => setIsFullScreen(false)} />
      <div className="h-full flex flex-col bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Live Preview</h3>
            <div className="flex items-center gap-1">
              {DEVICES.map((device) => (
                <button
                  key={device.id}
                  type="button"
                  aria-label={device.label}
                  onClick={() => setPreviewDevice(device.id)}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    previewDevice === device.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  <device.icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {hasCode && (
              <div className="flex items-center border rounded-md overflow-hidden mr-1">
                <button
                  type="button"
                  onClick={() => setShowCode(false)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors',
                    !showCode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <EyeIcon className="h-3 w-3" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setShowCode(true)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors',
                    showCode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Code2 className="h-3 w-3" />
                  Code
                </button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullScreen(true)} title="Full screen">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshPreview}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowPreview(false)}
            >
              <EyeOff className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {isGenerating && !hasGenerated && <PreviewSkeleton />}

          {isCodeGenerating && !showCode && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating live preview...
              </div>
            </div>
          )}

          {(!isGenerating || hasGenerated) && (
            <>
              {hasCode && showCode ? (
                <CodePreview files={generatedFiles} />
              ) : hasCode && !showCode ? (
                <IframePreview html={previewHtml!} deviceWidth={DEVICE_WIDTHS[previewDevice]} />
              ) : generatedSchema ? (
                <div
                  key={previewKey}
                  className={cn(
                    'h-full overflow-auto mx-auto transition-all duration-300',
                    DEVICE_WIDTHS[previewDevice],
                    previewDevice !== 'desktop' && 'border-x border-border shadow-xl',
                  )}
                >
                  <div className="h-full">{renderSchemaPreview(generatedSchema)}</div>
                </div>
              ) : (
                <EmptyPreview />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

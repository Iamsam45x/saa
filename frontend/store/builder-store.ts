import { create } from 'zustand';
import { toast } from 'sonner';
import type { ApplicationType, ThemeType, Feature } from '@/types';
import type { SolutionSchemaType } from '@/lib/solution-schema';
import { getAccessToken } from '@/components/auth/auth-context';

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface BuilderAction {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  snapshot: Partial<BuilderFormState>;
}

export interface BuilderFormState {
  projectName: string;
  description: string;
  targetAudience: string;
  location: string;
  applicationType: ApplicationType;
  selectedFeatures: Feature[];
  theme: ThemeType;
  customColors: CustomColors;
}

export interface GeneratedVersion {
  id: string;
  version: number;
  schema: SolutionSchemaType;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
  processingTimeMs: number;
  variation: string;
  projectId: string | null;
  provider: 'anthropic' | 'local';
  fallbackReason: string | null;
  storage: string;
  createdAt: string;
}

type GenerationStep =
  | 'idle'
  | 'analyzing'
  | 'selecting'
  | 'generating'
  | 'rendering'
  | 'complete'
  | 'error';

interface BuilderState extends BuilderFormState {
  currentProjectId: string | null;
  generatedSchema: SolutionSchemaType | null;
  versions: GeneratedVersion[];
  activeVersionId: string | null;
  isGenerating: boolean;
  generationStep: GenerationStep;
  generationStepLabel: string;
  tokenUsage: number;
  processingTime: number;
  hasGenerated: boolean;
  selectedVariation: string;
  actionHistory: BuilderAction[];
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  showPreview: boolean;
  previewKey: number;
  missingFields: string[];
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string;
  previewHtml: string | null;
  generatedFiles: GeneratedFile[];
  isCodeGenerating: boolean;
  showCode: boolean;

  setProjectName: (name: string) => void;
  setDescription: (desc: string) => void;
  setTargetAudience: (audience: string) => void;
  setLocation: (location: string) => void;
  setApplicationType: (type: ApplicationType) => void;
  setSelectedFeatures: (features: Feature[]) => void;
  addFeature: (feature: Feature) => void;
  removeFeature: (feature: Feature) => void;
  setTheme: (theme: ThemeType) => void;
  setCustomColors: (colors: Partial<CustomColors>) => void;
  applyCustomColors: () => void;
  setSelectedVariation: (variation: string) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setShowPreview: (show: boolean) => void;
  refreshPreview: () => void;

  generateSchema: () => Promise<void>;
  generatePreviewCode: () => Promise<void>;
  regenerate: (variation: string) => Promise<void>;
  saveProject: () => Promise<void>;
  restoreVersion: (versionId: string) => void;
  undo: () => void;
  resetForm: () => void;
  validateForm: () => string[];
  setShowCode: (show: boolean) => void;
}

const GENERATION_STEPS: Record<GenerationStep, string> = {
  idle: '',
  analyzing: 'Analyzing requirements...',
  selecting: 'Selecting registry components...',
  generating: 'Generating structured schema...',
  rendering: 'Rendering validated preview...',
  complete: 'Generation complete',
  error: 'Generation failed',
};

const INITIAL_FORM: BuilderFormState = {
  projectName: '',
  description: '',
  targetAudience: '',
  location: '',
  applicationType: 'Website',
  selectedFeatures: [],
  theme: 'corporate-blue',
  customColors: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#f0fdf4',
  },
};

function captureSnapshot(state: BuilderState): Partial<BuilderFormState> {
  return {
    projectName: state.projectName,
    description: state.description,
    targetAudience: state.targetAudience,
    location: state.location,
    applicationType: state.applicationType,
    selectedFeatures: [...state.selectedFeatures],
    theme: state.theme,
    customColors: { ...state.customColors },
  };
}

function appendAction(state: BuilderState, action: Omit<BuilderAction, 'id' | 'timestamp'>) {
  return [
    ...state.actionHistory.slice(-4),
    {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...action,
    },
  ];
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...INITIAL_FORM,

  currentProjectId: null,
  generatedSchema: null,
  versions: [],
  activeVersionId: null,
  isGenerating: false,
  generationStep: 'idle',
  generationStepLabel: '',
  tokenUsage: 0,
  processingTime: 0,
  hasGenerated: false,
  selectedVariation: '',
  actionHistory: [],
  previewDevice: 'desktop',
  showPreview: true,
  previewKey: 0,
  missingFields: [],
  saveStatus: 'idle',
  saveError: '',
  previewHtml: null,
  generatedFiles: [],
  isCodeGenerating: false,
  showCode: false,

  setProjectName: (projectName) => {
    const snapshot = captureSnapshot(get());
    set((state) => ({
      projectName,
      hasGenerated: false,
      saveStatus: 'idle',
      actionHistory: appendAction(state, {
        type: 'field',
        description: 'Updated project name',
        snapshot,
      }),
      missingFields: [],
    }));
  },

  setIndustry: () => {},

  setDescription: (description) =>
    set({ description, hasGenerated: false, saveStatus: 'idle', missingFields: [] }),

  setTargetAudience: (targetAudience) =>
    set({ targetAudience, hasGenerated: false, saveStatus: 'idle', missingFields: [] }),

  setLocation: (location) => set({ location, hasGenerated: false, saveStatus: 'idle' }),

  setApplicationType: (applicationType) =>
    set({
      applicationType,
      hasGenerated: false,
      generatedSchema: null,
      activeVersionId: null,
      saveStatus: 'idle',
      previewHtml: null,
      generatedFiles: [],
      isCodeGenerating: false,
    }),

  setSelectedFeatures: (selectedFeatures) =>
    set({ selectedFeatures, hasGenerated: false, saveStatus: 'idle', missingFields: [] }),

  addFeature: (feature) =>
    set((state) => ({
      selectedFeatures: state.selectedFeatures.includes(feature)
        ? state.selectedFeatures
        : [...state.selectedFeatures, feature],
      hasGenerated: false,
      saveStatus: 'idle',
      missingFields: [],
    })),

  removeFeature: (feature) =>
    set((state) => ({
      selectedFeatures: state.selectedFeatures.filter((f) => f !== feature),
      hasGenerated: false,
      saveStatus: 'idle',
    })),

  setTheme: (theme) => set({ theme, hasGenerated: false, saveStatus: 'idle' }),

  setCustomColors: (colors) =>
    set((state) => ({
      customColors: { ...state.customColors, ...colors },
      hasGenerated: false,
      saveStatus: 'idle',
    })),

  applyCustomColors: () => {
    const { customColors } = get();
    document.documentElement.style.setProperty('--custom-primary', customColors.primary);
    document.documentElement.style.setProperty('--custom-secondary', customColors.secondary);
    document.documentElement.style.setProperty('--custom-accent', customColors.accent);
    document.documentElement.style.setProperty('--custom-background', customColors.background);
    set((state) => ({ previewKey: state.previewKey + 1 }));
  },

  setSelectedVariation: (selectedVariation) => set({ selectedVariation }),

  setPreviewDevice: (previewDevice) => set({ previewDevice }),

  setShowPreview: (showPreview) => set({ showPreview }),

  setShowCode: (showCode) => set({ showCode }),

  refreshPreview: () => set((state) => ({ previewKey: state.previewKey + 1 })),

  generateSchema: async () => {
    const missing = get().validateForm();
    if (missing.length > 0) {
      set({ missingFields: missing });
      return;
    }

    set({
      isGenerating: true,
      hasGenerated: false,
      generationStep: 'analyzing',
      generationStepLabel: GENERATION_STEPS.analyzing,
      tokenUsage: 0,
      processingTime: 0,
      missingFields: [],
      saveStatus: 'idle',
      saveError: '',
    });

    const startTime = Date.now();
    const state = get();
    const variation = state.selectedVariation || 'layout';

    try {
      set({ generationStep: 'selecting', generationStepLabel: GENERATION_STEPS.selecting });

      const token = await getAccessToken();
      const res = await fetch('/api/ai/generate-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId: state.currentProjectId || undefined,
          name: state.projectName,
          description: state.description,
          targetAudience: state.targetAudience,
          location: state.location,
          applicationType: state.applicationType,
          features: state.selectedFeatures,
          theme: state.theme,
          customColors: state.customColors,
          variation,
        }),
      });

      set({ generationStep: 'generating', generationStepLabel: GENERATION_STEPS.generating });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error (${res.status})`);
      }

      const payload: GeneratedVersion = await res.json();
      const snapshot = captureSnapshot(get());

      set({ generationStep: 'rendering', generationStepLabel: GENERATION_STEPS.rendering });

      set((current) => ({
        isGenerating: false,
        hasGenerated: true,
        generationStep: 'complete',
        generationStepLabel: GENERATION_STEPS.complete,
        generatedSchema: payload.schema,
        activeVersionId: payload.id,
        versions: [...current.versions, payload],
        currentProjectId: payload.projectId || current.currentProjectId,
        tokenUsage: payload.tokenUsage?.total || 0,
        processingTime: payload.processingTimeMs || Date.now() - startTime,
        previewKey: current.previewKey + 1,
        actionHistory: appendAction(current, {
          type: 'generate',
          description: `Generated version ${payload.version || current.versions.length + 1}`,
          snapshot,
        }),
      }));
    } catch (err) {
      set({
        isGenerating: false,
        hasGenerated: false,
        generationStep: 'error',
        generationStepLabel: err instanceof Error ? err.message : 'Generation failed',
      });
      return;
    }

    get().generatePreviewCode();
  },

  generatePreviewCode: async () => {
    const state = get();
    if (!state.generatedSchema) return;

    set({ isCodeGenerating: true });

    try {
      const token = await getAccessToken();
      const res = await fetch('/api/ai/generate-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId: state.currentProjectId || undefined,
          name: state.projectName,
          description: state.description,
          targetAudience: state.targetAudience,
          location: state.location,
          applicationType: state.applicationType,
          features: state.selectedFeatures,
          theme: state.theme,
          customColors: state.customColors,
          variation: state.selectedVariation || 'layout',
          schema: state.generatedSchema,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Code generation error (${res.status})`);
      }

      const payload = await res.json();
      set({
        previewHtml: payload.previewHtml || null,
        generatedFiles: Array.isArray(payload.files) ? payload.files : [],
        isCodeGenerating: false,
      });
    } catch (err) {
      set({ isCodeGenerating: false });
      const message = err instanceof Error ? err.message : 'Preview code generation failed';
      toast.error('Code generation failed', { description: message });
      console.error('Preview code generation failed:', err);
    }
  },

  regenerate: async (variation) => {
    set({
      selectedVariation: variation,
      hasGenerated: false,
    });
    await get().generateSchema();
  },

  saveProject: async () => {
    const missing = get().validateForm();
    if (missing.length > 0) {
      set({ missingFields: missing });
      return;
    }

    if (!get().generatedSchema) {
      await get().generateSchema();
    }

    const state = get();
    if (!state.generatedSchema) return;

    set({ saveStatus: 'saving', saveError: '' });

    try {
      const token = await getAccessToken();
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: state.projectName,
          description: state.description,
          targetAudience: state.targetAudience,
          location: state.location,
          applicationType: state.applicationType,
          features: state.selectedFeatures,
          theme: state.theme,
          customColors: state.customColors,
          schema: state.generatedSchema,
          status: 'In Progress',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Save failed (${res.status})`);
      }

      const project = await res.json();
      const projectId = project.id || project.projectId || state.currentProjectId;

      set((current) => ({
        currentProjectId: projectId,
        saveStatus: 'saved',
        actionHistory: appendAction(current, {
          type: 'save',
          description: `Saved "${state.projectName}"`,
          snapshot: captureSnapshot(current),
        }),
      }));
    } catch (err) {
      set({
        saveStatus: 'error',
        saveError: err instanceof Error ? err.message : 'Save failed',
      });
    }
  },

  restoreVersion: (versionId) => {
    const version = get().versions.find((item) => item.id === versionId);
    if (!version) return;

    set((state) => ({
      generatedSchema: version.schema,
      activeVersionId: version.id,
      hasGenerated: true,
      previewKey: state.previewKey + 1,
      actionHistory: appendAction(state, {
        type: 'restore',
        description: `Restored version ${version.version}`,
        snapshot: captureSnapshot(state),
      }),
    }));
  },

  undo: () => {
    const { actionHistory } = get();
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory[actionHistory.length - 1];
    const prevState = lastAction.snapshot;

    set((state) => ({
      ...prevState,
      actionHistory: state.actionHistory.slice(0, -1),
      hasGenerated: false,
      generatedSchema: null,
      activeVersionId: null,
      generationStep: 'idle',
      generationStepLabel: '',
      saveStatus: 'idle',
      previewHtml: null,
      generatedFiles: [],
    }));
  },

  resetForm: () =>
    set({
      ...INITIAL_FORM,
      currentProjectId: null,
      generatedSchema: null,
      versions: [],
      activeVersionId: null,
      isGenerating: false,
      generationStep: 'idle',
      generationStepLabel: '',
      tokenUsage: 0,
      processingTime: 0,
      hasGenerated: false,
      selectedVariation: '',
      previewKey: 0,
      missingFields: [],
      saveStatus: 'idle',
      saveError: '',
      previewHtml: null,
      generatedFiles: [],
      isCodeGenerating: false,
      showCode: false,
    }),

  validateForm: () => {
    const state = get();
    const missing: string[] = [];
    if (!state.projectName.trim()) missing.push('Project Name');
    if (!state.description.trim()) missing.push('Business Description');
    if (!state.targetAudience.trim()) missing.push('Target Audience');
    if (state.selectedFeatures.length === 0) missing.push('Features');
    set({ missingFields: missing });
    return missing;
  },
}));

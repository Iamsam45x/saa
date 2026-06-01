import { create } from 'zustand';
import type { ApplicationType, ThemeType, Feature } from '@/types';

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

type GenerationStep =
  | 'idle'
  | 'analyzing'
  | 'selecting'
  | 'generating'
  | 'rendering'
  | 'complete'
  | 'error';

interface BuilderState extends BuilderFormState {
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
  regenerate: (variation: string) => void;
  undo: () => void;
  resetForm: () => void;
  validateForm: () => string[];
}

const GENERATION_STEPS: Record<GenerationStep, string> = {
  idle: '',
  analyzing: 'Analyzing requirements...',
  selecting: 'Selecting components...',
  generating: 'Generating schema...',
  rendering: 'Rendering preview...',
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

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...INITIAL_FORM,

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

  setProjectName: (projectName) => {
    const snapshot = captureSnapshot(get());
    set((state) => ({
      projectName,
      actionHistory: [
        ...state.actionHistory.slice(-2),
        {
          id: crypto.randomUUID(),
          type: 'field',
          description: 'Updated project name',
          timestamp: Date.now(),
          snapshot,
        },
      ],
      missingFields: [],
    }));
  },

  setDescription: (description) => set({ description, missingFields: [] }),

  setTargetAudience: (targetAudience) => set({ targetAudience }),

  setLocation: (location) => set({ location }),

  setApplicationType: (applicationType) => set({ applicationType }),

  setSelectedFeatures: (selectedFeatures) => set({ selectedFeatures }),

  addFeature: (feature) =>
    set((state) => ({
      selectedFeatures: state.selectedFeatures.includes(feature)
        ? state.selectedFeatures
        : [...state.selectedFeatures, feature],
    })),

  removeFeature: (feature) =>
    set((state) => ({
      selectedFeatures: state.selectedFeatures.filter((f) => f !== feature),
    })),

  setTheme: (theme) => set({ theme }),

  setCustomColors: (colors) =>
    set((state) => ({
      customColors: { ...state.customColors, ...colors },
    })),

  applyCustomColors: () => {
    const { customColors } = get();
    const themeColors = {
      primary: customColors.primary,
      secondary: customColors.secondary,
      accent: customColors.accent,
      background: customColors.background,
      surface: customColors.background,
      text: customColors.primary,
    };
    document.documentElement.style.setProperty('--custom-primary', themeColors.primary);
    document.documentElement.style.setProperty('--custom-secondary', themeColors.secondary);
    document.documentElement.style.setProperty('--custom-accent', themeColors.accent);
    document.documentElement.style.setProperty('--custom-background', themeColors.background);
  },

  setSelectedVariation: (selectedVariation) => set({ selectedVariation }),

  setPreviewDevice: (previewDevice) => set({ previewDevice }),

  setShowPreview: (showPreview) => set({ showPreview }),

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
    });

    const startTime = Date.now();
    const steps: GenerationStep[] = ['analyzing', 'selecting', 'generating', 'rendering'];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));
      set({
        generationStep: step,
        generationStepLabel: GENERATION_STEPS[step],
        tokenUsage: get().tokenUsage + Math.floor(Math.random() * 50 + 20),
        processingTime: Date.now() - startTime,
      });
    }

    const snapshot = captureSnapshot(get());

    set((state) => ({
      isGenerating: false,
      hasGenerated: true,
      generationStep: 'complete',
      generationStepLabel: GENERATION_STEPS.complete,
      processingTime: Date.now() - startTime,
      actionHistory: [
        ...state.actionHistory.slice(-2),
        {
          id: crypto.randomUUID(),
          type: 'generate',
          description: `Generated UI schema for "${state.projectName}"`,
          timestamp: Date.now(),
          snapshot,
        },
      ],
    }));
  },

  regenerate: (variation) => {
    set({
      selectedVariation: variation,
      hasGenerated: false,
    });
    get().generateSchema();
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
      generationStep: 'idle',
      generationStepLabel: '',
    }));
  },

  resetForm: () =>
    set({
      ...INITIAL_FORM,
      isGenerating: false,
      generationStep: 'idle',
      generationStepLabel: '',
      tokenUsage: 0,
      processingTime: 0,
      hasGenerated: false,
      selectedVariation: '',
      previewKey: 0,
      missingFields: [],
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

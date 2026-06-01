import { create } from 'zustand';

export type ApplicationType = 'Website' | 'CRM' | 'ERP' | 'Mobile App' | 'SaaS Platform';

export interface Project {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  location: string;
  applicationType: ApplicationType;
  features: string[];
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...data }
          : state.currentProject,
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

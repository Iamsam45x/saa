import { useProjectStore, type Project, type ApplicationType } from '@/store/project-store';

export function useProject() {
  const store = useProjectStore();

  const createProject = (data: {
    name: string;
    description: string;
    applicationType: ApplicationType;
  }) => {
    const project: Project = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      targetAudience: '',
      location: '',
      applicationType: data.applicationType,
      features: [],
      theme: 'corporate-blue',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.addProject(project);
    store.setCurrentProject(project);
    return project;
  };

  return {
    ...store,
    createProject,
  };
}

import {createStore} from 'zustand/vanilla';
import {devtools} from 'zustand/middleware';

interface ProjectState {
  activeProjectId: number | null;
}

export type ProjectActions = {
  setActiveProjectId: (id: number) => void;
  clearActiveProject: () => void;
};

export type ProjectStore = ProjectState & ProjectActions;

export const initProjectStore = (): ProjectState => {
  return {activeProjectId: null};
};

export const defaultInitState: ProjectState = {
  activeProjectId: null,
};

export const createProjectStore = (
  initState: ProjectState = defaultInitState,
) => {
  return createStore<ProjectStore>()(
    devtools((set) => ({
      ...initState,
      setActiveProjectId: (id) => set({activeProjectId: id}),
      clearActiveProject: () => set({activeProjectId: null}),
    })),
  );
};

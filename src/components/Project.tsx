'use client';

import {Database} from '@/lib/supabase.types';

type Project = Database['public']['Tables']['projects']['Row'];

type ProjectsProps = {
  project: Project;
};

export default function Project({project}: ProjectsProps) {
  const showProject = (project: Project) => {
    return <p>{project.name}</p>;
  };

  return <div className="card">{showProject(project)}</div>;
}

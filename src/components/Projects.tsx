'use client';

import {Database} from '@/lib/supabase.types';
import Link from 'next/link';

type Project = Database['public']['Tables']['projects']['Row'];

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({projects}: ProjectsProps) {
  const showProject = (project: Project) => {
    const projectPath = '/projects/' + project.id;
    return (
      <Link className="button" href={projectPath}>
        {project.name}
      </Link>
    );
  };

  return <div className="card">{projects.map(showProject)}</div>;
}

'use client';

import {Database} from '@/lib/supabase.types';
import {useEffect, useState} from 'react';

type Project = Database['public']['Tables']['projects']['Row'];

export default function Project({projectId}: {projectId: string}) {
  const [project, setProject] = useState<Project | null>();
  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      setProject(data);
    };
    getProjects();
  }, []);
  const showProject = (project: Project) => {
    return <p>{project.name}</p>;
  };

  return project ? <div className="card">{showProject(project)}</div> : <></>;
}

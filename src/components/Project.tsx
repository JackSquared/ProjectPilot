'use client';

import {Database} from '@/lib/supabase.types';
import {useEffect, useState} from 'react';
import {Card, CardTitle} from '@/components/ui/card';
import {Button} from './ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

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
    return (
      <Card>
        <CardTitle>{project.name}</CardTitle>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{project.name.at(0)}</AvatarFallback>
        </Avatar>

        <p>{project.description}</p>
        <Button>Generate project image</Button>
      </Card>
    );
  };

  return project ? <div className="card">{showProject(project)}</div> : <></>;
}

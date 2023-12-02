'use client';

import {Database} from '@/lib/supabase.types';
import {useEffect, useState} from 'react';
import {Card, CardTitle} from '@/components/ui/card';
import {Button} from './ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

type Project = Database['public']['Tables']['projects']['Row'];

export default function Project({projectId}: {projectId: string}) {
  const [project, setProject] = useState<Project | null>();
  const [projectIcon, setProjectIcon] = useState<string | null>();

  const generateImage = async () => {
    const res = await fetch(`/api/projects/${projectId}/generate-image`);
    const data = await res.json();
    setProjectIcon(data);
  };

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
          <AvatarImage src={projectIcon ? projectIcon : ''} />
          <AvatarFallback>{project.name.at(0)}</AvatarFallback>
        </Avatar>

        <p>{project.description}</p>
        <Button onClick={generateImage}>Generate project image</Button>
      </Card>
    );
  };

  return project ? <div className="card">{showProject(project)}</div> : <></>;
}

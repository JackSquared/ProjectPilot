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
      <Card className="flex flex-col items-center justify-start p-6 h-full">
        <div className="flex flex-col items-center mb-8">
          <CardTitle className="mb-4">{project.name}</CardTitle>
          <Avatar className="mb-4">
            <AvatarImage src={projectIcon ? projectIcon : ''} />
            <AvatarFallback>{project.name.at(0)}</AvatarFallback>
          </Avatar>
          <Button onClick={generateImage}>Generate project image</Button>
        </div>

        <p>{project.description}</p>
      </Card>
    );
  };

  return project ? <div className="h-full">{showProject(project)}</div> : <></>;
}

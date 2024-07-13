'use server';

import {Database} from '@/lib/supabase.types';
import {Card, CardTitle} from '@/components/ui/card';
import ProjectIcon from './ProjectIcon';
import {generateProjectIcon} from '@/app/actions/generateProjectIcon';

type Project = Database['public']['Tables']['projects']['Row'];

export default async function Project({project}: {project: Project}) {
  const showProject = (project: Project) => {
    return (
      <Card className="flex flex-col items-center justify-start p-6 h-full">
        <div className="flex flex-col items-center mb-8">
          <CardTitle className="mb-4">{project.name}</CardTitle>
          <ProjectIcon
            projectId={project.id}
            projectName={project.name}
            generateProjectIcon={generateProjectIcon}
          />
        </div>
        <p>{project.description}</p>
      </Card>
    );
  };

  return project ? <div className="h-full">{showProject(project)}</div> : null;
}

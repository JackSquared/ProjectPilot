'use client';

import {useState} from 'react';
import {Database} from '@/lib/supabase.types';
import {Card, CardTitle} from '@/components/ui/card';
import ProjectIcon from './ProjectIcon';
import {generateProjectIcon} from '@/app/actions/generateProjectIcon';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Pencil, Save} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

type Project = Database['public']['Tables']['projects']['Row'];

export default function Project({project: serverProject}: {project: Project}) {
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState(serverProject);

  const supabase = createClient();

  const handleSave = async () => {
    const {error} = await supabase.from('projects').upsert(project);
    if (error) {
      console.error(error);
    }
    setIsEditing(false);
  };

  return (
    <Card className="flex flex-col items-center justify-start p-6 h-full">
      <>
        <div className="flex flex-col items-center mb-8">
          <CardTitle className="mb-4">
            {isEditing ? (
              <Input
                value={project.name}
                onChange={(e) => setProject({...project, name: e.target.value})}
                className="text-center"
              />
            ) : (
              project.name
            )}
          </CardTitle>
          <ProjectIcon
            projectId={project.id}
            projectName={project.name}
            generateProjectIcon={generateProjectIcon}
          />
        </div>
        {isEditing ? (
          <Textarea
            value={project.description || ''}
            onChange={(e) =>
              setProject({...project, description: e.target.value})
            }
            className="mb-4"
          />
        ) : (
          <p>{project.description}</p>
        )}
        {isEditing ? (
          <Save className="w-4 h-4 mr-2 cursor-pointer" onClick={handleSave} />
        ) : (
          <div className="mt-4">
            <Pencil
              className="w-4 h-4 mr-2 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </div>
        )}
      </>
    </Card>
  );
}

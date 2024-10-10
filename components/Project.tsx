'use client';

import React, {useState, useEffect} from 'react';
import {Database} from '@/lib/supabase.types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Pencil, Save} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import ConnectedRepository from './ConnectedRepository';
import {useMediaQuery} from 'react-responsive';
import {cn} from '@/lib/utils';
import {Textarea} from './ui/textarea';
import KanbanBoard from './KanbanBoard';

type Project = Database['public']['Tables']['projects']['Row'];

type ProjectProps = {
  project: Project;
  providerToken: string | null;
};

export default function Project({
  project: serverProject,
  providerToken,
}: ProjectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState(serverProject);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const isMobile = useMediaQuery({maxWidth: 1240});

  useEffect(() => {
    const projectChannel = supabase
      .channel('projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${project.id}`,
        },
        (payload) => {
          setProject(payload.new as Project);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectChannel);
    };
  }, []);

  const handleSave = async () => {
    const {error} = await supabase.from('projects').upsert(project);
    if (error) {
      console.error(error);
      setError('Failed to save project.');
    } else {
      setIsEditing(false);
      setError(null);
    }
  };

  const combinedTags = [
    ...(project.client_tags || []).map((tag) => ({
      name: tag,
      color: 'bg-blue-500',
    })),
    ...(project.server_tags || []).map((tag) => ({
      name: tag,
      color: 'bg-teal-500',
    })),
    ...(project.ops_tags || []).map((tag) => ({
      name: tag,
      color: 'bg-green-600',
    })),
  ];

  return (
    <div
      className={cn(
        'overflow-y-auto scrollbar-hide',
        isMobile ? 'w-full' : 'w-1/2',
      )}
    >
      <div className="h-full p-6">
        <div className="space-y-6">
          <Card>
            <div className="p-4 relative">
              <div className="absolute top-4 right-4">
                {isEditing ? (
                  <Button variant="ghost" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={project.name}
                    onChange={(e) =>
                      setProject({...project, name: e.target.value})
                    }
                    className="text-3xl font-bold text-primary mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-primary mb-2">
                    {project.name}
                  </h1>
                )}
                {isEditing ? (
                  <Textarea
                    value={project.description || ''}
                    onChange={(e) =>
                      setProject({...project, description: e.target.value})
                    }
                    className="text-muted-foreground"
                  />
                ) : (
                  <p className="text-muted-foreground">{project.description}</p>
                )}
              </div>
            </div>
          </Card>

          {error && <div className="text-red-500">{error}</div>}

          <KanbanBoard projectId={project.id} />

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {combinedTags.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`${tech.color} text-white`}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <ConnectedRepository
            projectId={project.id}
            providerToken={providerToken}
            onSelect={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

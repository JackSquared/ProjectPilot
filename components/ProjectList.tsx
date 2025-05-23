'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Database} from '@/lib/supabase.types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {CalendarIcon, ArrowRightIcon} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {useProjectStore} from '@/components/ProjectProvider';
import {useRouter} from 'next/navigation';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectList({
  serverProjects,
}: {
  serverProjects: Project[];
}) {
  const [projects, setProjects] = useState(serverProjects);
  const supabase = createClient();
  const {activeProjectId} = useProjectStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    setProjects(serverProjects);
  }, [serverProjects]);

  useEffect(() => {
    const channel = supabase
      .channel('projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          setProjects((currentProjects: Project[]) => {
            const updatedProjects = [
              ...currentProjects,
              payload.new as Project,
            ];
            return updatedProjects.sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            );
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [serverProjects]);

  if (activeProjectId) {
    router.push(`/projects/${activeProjectId}`);
    return <div>Remove me - blank screen for loading project page.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-6">
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">
                {project.description || 'No description available.'}
              </p>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant="secondary">{'No status'}</Badge>
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center text-primary hover:underline"
              >
                View Project <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">
            Chat with Project Pilot to create your first project.
          </p>
        </div>
      )}
    </div>
  );
}

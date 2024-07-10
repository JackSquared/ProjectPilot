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
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {useRouter} from 'next/navigation';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[] | null>();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    };
    getProjects();
  }, []);

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
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 gap-6">
      {projects?.map((project) => (
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
      ))}
    </div>
  );
}

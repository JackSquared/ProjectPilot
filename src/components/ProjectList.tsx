'use client';

import {Database} from '@/lib/supabase.types';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {useRouter} from 'next/navigation';
import {Card, CardContent} from '@/components/ui/card';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectList() {
  const supabase = createClientComponentClient<Database>();
  const [projects, setProjects] = useState<Project[] | null>();
  const router = useRouter();

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

  const showProject = (project: Project) => {
    const projectPath = '/projects/' + project.id;
    return (
      <Card>
        <CardContent>
          <Link className="button" href={projectPath}>
            {project.name}
          </Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">{projects?.map(showProject)}</div>
  );
}

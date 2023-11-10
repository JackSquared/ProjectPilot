'use client';

import {Database} from '@/lib/supabase.types';
import Link from 'next/link';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

type Project = Database['public']['Tables']['projects']['Row'];

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({projects}: ProjectsProps) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

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
      <div className="project_card">
        <Link className="button" href={projectPath}>
          {project.name}
        </Link>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">{projects?.map(showProject)}</div>
  );
}

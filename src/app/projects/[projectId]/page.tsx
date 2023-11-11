import Project from '@/app/components/Project';
import {Database} from '@/lib/supabase.types';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {notFound, redirect} from 'next/navigation';

export default async function ProjectPage({
  params,
}: {
  params: {projectId: string};
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const {data: project} = await supabase
    .from('projects')
    .select()
    .match({id: params.projectId})
    .single();

  if (!project) {
    notFound();
  }

  return <Project project={project} />;
}

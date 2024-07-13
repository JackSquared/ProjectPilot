import Project from '@/components/Project';
import {Database} from '@/lib/supabase.types';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

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
    .select('*')
    .eq('id', params.projectId)
    .single();

  if (!project) {
    return <div>Project not found</div>;
  }

  return <Project project={project} projectId={params.projectId} />;
}

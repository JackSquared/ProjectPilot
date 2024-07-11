import Project from '@/components/Project';
import {createClient} from '@/utils/supabase/server';
import {redirect} from 'next/navigation';

export default async function ProjectPage({
  params,
}: {
  params: {projectId: string};
}) {
  const supabase = createClient();

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
    redirect('/');
  }

  return <Project serverProject={project} />;
}

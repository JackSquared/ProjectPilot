import Project from '@/components/Project';
import {createClient} from '@/lib/supabase/server';

export default async function ProjectPage({
  params,
}: {
  params: {projectId: string};
}) {
  const supabase = createClient();

  const {data: project} = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single();

  const {
    data: {session},
  } = await supabase.auth.getSession();

  const providerToken = session?.provider_token || null;

  if (!project) {
    return <div>Project not found</div>;
  }

  return <Project project={project} providerToken={providerToken} />;
}

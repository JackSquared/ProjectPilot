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

  if (!project) {
    return <div>Project not found</div>;
  }

  return <Project project={project} />;
}

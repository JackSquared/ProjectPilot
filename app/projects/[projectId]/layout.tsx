import ProjectChat from '@/components/ProjectChat';
import {createClient} from '@/lib/supabase/server';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {projectId: string};
}) {
  const supabase = createClient();

  const {data: project} = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single();

  return (
    <div className="flex h-full">
      <div className="w-1/2 overflow-y-auto scrollbar-hide">{children}</div>
      <div className="w-1/2 border-l border-border">
        <ProjectChat project={project} />
      </div>
    </div>
  );
}

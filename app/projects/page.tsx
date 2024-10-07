import ProjectList from '../../components/ProjectList';
import {createClient} from '@/lib/supabase/server';

export const revalidate = 0;

export default async function Projects() {
  const supabase = createClient();

  const {data} = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', {ascending: false});

  if (!data) {
    return <div>No projects</div>;
  }

  return (
    <div className="p-4">
      <ProjectList serverProjects={data} />
    </div>
  );
}

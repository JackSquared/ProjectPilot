import {createClient} from '@/utils/supabase/server';
import {redirect} from 'next/navigation';
import ProjectList from '../../components/ProjectList';

export const revalidate = 0;

export default async function Projects() {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const {data} = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', {ascending: false});

  if (!data) {
    return <div>No projects</div>;
  }

  return <ProjectList serverProjects={data} />;
}

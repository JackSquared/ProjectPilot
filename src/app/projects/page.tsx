import Projects from '@/components/Projects';
import {Database} from '@/lib/supabase.types';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export default async function ProjectsPage() {
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

  const {data: projects, error} = await supabase.from('projects').select('*');

  return <Projects projects={projects} />;
}

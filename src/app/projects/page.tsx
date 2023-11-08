import Projects from '@/components/Projects';
import {Database} from '@/lib/supabase.types';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {notFound, redirect} from 'next/navigation';

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

  const {data: projects} = await supabase.from('projects').select('*');

  if (!projects) {
    notFound();
  }

  return <Projects projects={projects} />;
}

import {cookies} from 'next/headers';
import {notFound, redirect} from 'next/navigation';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import {Database} from '@/lib/supabase.types';
import Projects from '@/app/projects/page';

export default async function Home() {
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

  return (
    <>
      <Link className="button fixed right-0 mr-8" href="/profile">
        Go to Profile
      </Link>
      <div className="">
        <Projects projects={projects} />
      </div>
    </>
  );
}

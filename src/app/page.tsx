import {redirect} from 'next/navigation';
import {createClient} from '@/utils/supabase/server';
import Projects from '@/app/projects/page';

export default async function Home() {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <div className="">
        <Projects />
      </div>
    </>
  );
}

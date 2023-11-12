import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import {Database} from '@/lib/supabase.types';
import Chat from './components/Chat';

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

  return (
    <>
      <Link className="button fixed right-0 mr-8" href="/profile">
        Go to Profile
      </Link>
      <div className="">
        <Chat />
      </div>
    </>
  );
}

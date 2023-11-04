import Chat from '@/components/Chat';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <Link className="button fixed right-0 mr-8" href="/profile">
        Go to Profile
      </Link>
      <Chat />
    </>
  );
}

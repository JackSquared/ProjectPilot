import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

import UpdatePassword from '@/components/Auth/UpdatePassword';

export default async function UpdatePasswordPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});

  const {
    data: {session},
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return <UpdatePassword />;
}

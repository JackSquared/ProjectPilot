import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

import SignIn from '@/app/components/Auth/SignIn';

export default async function SignInPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});
  const {data} = await supabase.auth.getSession();

  if (data?.session) {
    redirect('/');
  }

  return <SignIn />;
}

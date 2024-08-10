import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import SignUp from '@/components/Auth/SignUp';

export default async function SignUpPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({cookies: () => cookieStore});
  const {data} = await supabase.auth.getSession();

  if (data?.session) {
    redirect('/');
  }

  return <SignUp />;
}

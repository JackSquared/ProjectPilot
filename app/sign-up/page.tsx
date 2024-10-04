import {redirect} from 'next/navigation';
import SignUp from '@/components/Auth/SignUp';
import {createClient} from '@/lib/supabase/server';

export default async function SignUpPage() {
  const supabase = createClient();
  const {data} = await supabase.auth.getSession();

  if (data?.session) {
    redirect('/');
  }

  return <SignUp />;
}

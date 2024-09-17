import {redirect} from 'next/navigation';

import ResetPassword from '@/components/Auth/ResetPassword';
import {createClient} from '@/lib/supabase/server';

export default async function ResetPasswordPage() {
  const supabase = createClient();
  const {data} = await supabase.auth.getSession();

  if (data?.session) {
    redirect('/');
  }

  return <ResetPassword />;
}

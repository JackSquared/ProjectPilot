'use client';

import {createClient} from '@/utils/supabase/client';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

export default function SignOut() {
  const supabase = createClient();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/sign-in');
  }

  return (
    <Button type="button" className="button-inverse" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}

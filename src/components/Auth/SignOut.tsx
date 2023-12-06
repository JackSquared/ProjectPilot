'use client';

import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {Button} from '@/components/ui/button';

export default function SignOut() {
  const supabase = createClientComponentClient();

  async function handleSignOut() {
    const {error} = await supabase.auth.signOut();

    if (error) {
      console.error('ERROR:', error);
    }
  }

  return (
    <Button type="button" className="button-inverse" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}

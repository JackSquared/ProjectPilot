'use client';

import {Button} from '@/components/ui/button';
import {createClient} from '@/lib/supabase/client';

export default function SignOut() {
  const supabase = createClient();

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

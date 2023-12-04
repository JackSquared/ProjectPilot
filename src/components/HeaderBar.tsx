import Link from 'next/link';
import {ModeToggle} from './ModeToggle';
import {User} from '@supabase/supabase-js';

export function HeaderBar({user}: {user: User | undefined}) {
  return (
    <>
      <ModeToggle />
      {user ? (
        <Link className="button fixed right-0 mr-8" href="/profile">
          Go to Profile
        </Link>
      ) : (
        <></>
      )}
    </>
  );
}

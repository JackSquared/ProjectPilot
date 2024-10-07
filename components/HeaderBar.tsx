'use client';

import Link from 'next/link';
import {ModeToggle} from './ModeToggle';
import {User2, Home} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Session} from '@supabase/supabase-js';

export function HeaderBar({session}: {session: Session | null}) {
  return (
    <header className="flex items-center p-2 border-b border-primary/20">
      {session && (
        <Link href="/" passHref>
          <Button variant="outline" className="ml-4">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
      )}
      <div className="flex-grow" />
      <ModeToggle className="mr-2" />
      {session && (
        <Link href="/profile" passHref>
          <Button variant="outline" className="mr-4">
            <User2 className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </header>
  );
}

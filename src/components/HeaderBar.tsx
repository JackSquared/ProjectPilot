'use client';

import Link from 'next/link';
import {ModeToggle} from './ModeToggle';
import {User} from '@supabase/supabase-js';
import {User2, Menu} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function HeaderBar({user}: {user: User | undefined}) {
  return (
    <div className="flex my-5">
      <AppMenu className="flex-1" />
      <ModeToggle className="flex-2 mx-5" />
      {user && <UserMenu className="flex-3" />}
    </div>
  );
}

function UserMenu({className}: {className?: string}) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <User2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {}}>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function AppMenu({className}: {className?: string}) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {}}>
            <Link href="/">Home</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

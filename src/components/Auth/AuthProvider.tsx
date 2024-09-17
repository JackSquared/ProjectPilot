'use client';

import {createContext, useEffect, ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

export const AuthContext = createContext(null);

interface AuthProviderProps {
  accessToken: string | null;
  children: ReactNode;
}

const AuthProvider = ({accessToken, children}: AuthProviderProps) => {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: {subscription: authListener},
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
};

export default AuthProvider;

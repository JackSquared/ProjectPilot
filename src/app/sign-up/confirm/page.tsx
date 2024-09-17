'use client';

import {Button} from '@/components/ui/button';
import {useSearchParams} from 'next/navigation';
import {useState, useEffect} from 'react';
import {User} from '@supabase/supabase-js';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

const ConfirmSignUp = () => {
  const [user, setUser] = useState<User | undefined>();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchUser = async () => {
      const {data} = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };
    fetchUser();
  }, []);

  const confirmation_url = searchParams.get('confirmation_url');

  const handleConfirmSignUp = () => {
    if (confirmation_url) {
      window.location.href = confirmation_url;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p>Confirm your account</p>
      <Button
        className="mt-4"
        onClick={handleConfirmSignUp}
        disabled={!confirmation_url}
      >
        Confirm Sign Up
      </Button>
    </div>
  );
};

export default ConfirmSignUp;

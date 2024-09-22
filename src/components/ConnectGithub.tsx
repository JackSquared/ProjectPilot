'use client';

import {createClient} from '@/lib/supabase/client';
import {Button} from './ui/button';
import {useEffect, useState} from 'react';
import {AuthError, UserIdentity} from '@supabase/supabase-js';

export function ConnectGithub({connected}: {connected: boolean}) {
  const supabase = createClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const [identities, setIdentities] = useState<UserIdentity[] | null>(null);

  useEffect(() => {
    const fetchGithubIdentity = async () => {
      const {data} = await supabase.auth.getUserIdentities();
      setIdentities(data?.identities || null);
    };
    fetchGithubIdentity();
  }, []);

  const unlinkIdentity = async () => {
    if (identities && identities.length < 2) {
      setError(new AuthError('You need to have at least one identity'));
      return;
    }
    const githubIdentity = identities?.find(
      (identity) => identity.provider === 'github',
    );

    if (!githubIdentity) {
      console.log('No GitHub identity found');
      return;
    }

    const {error} = await supabase.auth.unlinkIdentity(githubIdentity);

    if (error) {
      console.log(error);
    }
  };

  const linkIdentity = async () => {
    setPending(true);
    await supabase.auth.linkIdentity({
      provider: 'github',
    });

    setPending(false);
  };

  return (
    <>
      {connected ? (
        <form onSubmit={unlinkIdentity}>
          <Button onClick={unlinkIdentity}>Unlink Github</Button>
        </form>
      ) : (
        <Button className="mb-4" onClick={linkIdentity} disabled={pending}>
          {pending ? 'Connecting...' : 'Connect Github'}
        </Button>
      )}
      {error && <p className="text-red-500">{error.message}</p>}
    </>
  );
}

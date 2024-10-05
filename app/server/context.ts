import {createClient} from '@/lib/supabase/server';
import {getUserFromCookies} from '@/app/server/getUser';

export const createContext = async () => {
  const user = await getUserFromCookies();
  const db = createClient();

  return {
    user,
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

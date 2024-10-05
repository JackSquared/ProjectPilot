import {type User} from '@supabase/supabase-js';
import {createClient} from '@/lib/supabase/server';

export const getUserFromCookies = async (): Promise<User | null> => {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  return user;
};

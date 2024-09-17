'use server';

import {createClient} from '@/lib/supabase/server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/sign-in');
}

export async function login(email: string, password: string) {
  const supabase = createClient();
  const {error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {error: {message: error.message}};
  }

  redirect('/');
}

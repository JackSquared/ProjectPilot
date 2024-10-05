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

  return;
}

export async function loginWithGithub() {
  const supabase = createClient();

  const host =
    process.env.VERCEL_URL === 'http://localhost:3000'
      ? process.env.VERCEL_URL
      : 'https://' + process.env.VERCEL_URL;

  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${host}/auth/callback`,
    },
  });
  if (error) {
    return {error: {message: error.message}};
  }

  if (data.url) {
    redirect(data.url);
  }

  return;
}

export async function linkGithub() {
  const supabase = createClient();
  const {data, error} = await supabase.auth.linkIdentity({
    provider: 'github',
    options: {
      scopes: 'repo',
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  });

  if (error) {
    return {error: {message: error.message}};
  }

  if (data.url) {
    redirect(data.url);
  }

  return;
}

import 'server-only';

import {JWTPayload, jwtVerify} from 'jose';

import {createClient} from '@/lib/supabase/server';

type SupabaseJwtPayload = JWTPayload & {
  app_metadata: {
    role: string;
  };
};

export async function getUserRole() {
  const supabase = createClient();

  const {
    data: {session},
  } = await supabase.auth.getSession();

  let role;

  if (!process.env.SUPABASE_JWT_SECRET) {
    throw new Error('SUPABASE_JWT_SECRET is not set');
  }

  if (session) {
    const token = session.access_token;

    try {
      const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
      const {payload} = await jwtVerify<SupabaseJwtPayload>(token, secret);

      console.log(payload);
      role = payload.app_metadata.role;
      console.log('User role:', role);
    } catch (error) {
      console.error('Failed to verify token:', error);
    }
  }

  return role;
}

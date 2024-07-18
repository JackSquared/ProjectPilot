'use server';

import {createClient} from '@supabase/supabase-js';
import {revalidatePath} from 'next/cache';

export async function insertSecret(secretName: string, secretValue: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const {error} = await supabase.rpc('insert_secret', {
    name: secretName,
    secret: secretValue,
  });

  if (error) {
    return {success: false, message: 'Failed to update API key'};
  } else {
    revalidatePath('/');
    return {success: true, message: 'API key updated successfully'};
  }
}

'use server';

import {Database} from '@/lib/supabase.types';
import {createServerActionClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {OpenAI} from 'openai';

export async function generateProjectIcon(projectId: number) {
  const supabase = createServerActionClient<Database>({cookies});
  await supabase.auth.getSession();

  const {data: project} = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt:
      'a project icon for the following description ' + project?.description,
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  });

  const image_url = response.data[0].url;

  return image_url || null;
}

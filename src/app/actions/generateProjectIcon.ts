'use server';

import {OpenAI} from 'openai';
import {createClient} from '@/lib/supabase/server';

export async function generateProjectIcon(projectId: number) {
  const supabase = createClient();
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

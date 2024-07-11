import {createClient} from '@/utils/supabase/server';
import {NextResponse} from 'next/server';
import {OpenAI} from 'openai';

export async function GET(
  request: Request,
  {params}: {params: {projectId: string}},
) {
  const supabase = createClient();
  await supabase.auth.getSession();
  const {data: project} = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const response = client.images.generate({
    model: 'dall-e-3',
    prompt:
      'a project icon for the following description ' + project?.description,
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  });
  const image_url = (await response).data[0].url;

  return NextResponse.json(image_url);
}

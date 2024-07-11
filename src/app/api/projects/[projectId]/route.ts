import {createClient} from '@/utils/supabase/server';
import {NextResponse} from 'next/server';

export async function GET(
  request: Request,
  {params}: {params: {projectId: string}},
) {
  const supabase = createClient();
  await supabase.auth.getSession();
  const {data: projects} = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single();

  return NextResponse.json(projects);
}

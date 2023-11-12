import {Database} from '@/lib/supabase.types';
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export async function GET(
  request: Request,
  {params}: {params: {projectId: string}},
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase.auth.getSession();
  const {data: projects} = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single();

  return NextResponse.json(projects);
}

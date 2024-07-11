import {createClient} from '@/utils/supabase/server';
import {NextResponse} from 'next/server';

export async function GET() {
  const supabase = createClient();
  await supabase.auth.getSession();
  const {data: projects} = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', {ascending: false});

  return NextResponse.json(projects);
}

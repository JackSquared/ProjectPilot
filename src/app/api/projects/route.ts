import {Database} from '@/lib/supabase.types';
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase.auth.getSession();
  const {data: projects} = await supabase.from('projects').select('*');

  return NextResponse.json(projects);
}

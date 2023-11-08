import {SupabaseClient} from '@supabase/supabase-js';
import {Database} from '../supabase.types';

export function getProjectById(client: SupabaseClient, projectId: number) {
  return client
    .from('projects')
    .select(
      `
        id,
        name,
        description
      `,
    )
    .eq('id', projectId)
    .throwOnError()
    .single();
}

export function getProjects(client: SupabaseClient) {
  return client
    .from('projects')
    .select(
      `
    id,
    name`,
    )
    .throwOnError();
}

export async function tryCreateProject(
  client: SupabaseClient<Database>,
  name: string,
  description: string,
  user_id: string,
) {
  const {data} = await client
    .from('projects')
    .insert([{name, description, user_id: user_id}])
    .select();

  return data;
}

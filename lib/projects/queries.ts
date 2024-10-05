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

export async function getProjects(client: SupabaseClient<Database>) {
  const {data} = await client.from('projects').select('*');
  return data;
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

  return data?.[0];
}

export async function tryUpdateProject(
  client: SupabaseClient<Database>,
  projectId: number,
  name: string,
  description: string,
) {
  const {data} = await client
    .from('projects')
    .update({name, description})
    .eq('id', projectId)
    .select()
    .single();

  return data;
}

export async function tryAddTask(
  client: SupabaseClient<Database>,
  projectId: number,
  title: string,
  description: string | null,
  status: string,
) {
  const {data} = await client
    .from('tasks')
    .insert({project_id: projectId, title, description, status})
    .select()
    .single();
  return data;
}

export async function tryUpdateProjectTags(
  client: SupabaseClient<Database>,
  projectId: number,
  serverTags: string[] | null,
  clientTags: string[] | null,
  opsTags: string[] | null,
) {
  const {data} = await client
    .from('projects')
    .update({
      server_tags: serverTags,
      client_tags: clientTags,
      ops_tags: opsTags,
    })
    .eq('id', projectId)
    .select()
    .single();

  return data;
}

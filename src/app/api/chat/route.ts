import {openai} from '@ai-sdk/openai';
import {convertToCoreMessages, streamText} from 'ai';
import {z} from 'zod';
import {createClient} from '@/lib/supabase/server';
import {tryCreateProject} from '@/lib/projects/queries';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(req: Request) {
  const supabase = createClient();

  async function createProject(name: string, description: string) {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw 'no user!';
      }

      return tryCreateProject(supabase, name, description, user.id);
    } catch (error) {
      console.error(error);
    }
  }

  const {messages} = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    tools: {
      createProject: {
        description: 'Create a new project',
        parameters: z.object({
          name: z.string().describe('The name of the new project'),
          description: z
            .string()
            .describe('The description of the new project'),
        }),
        execute: async ({
          name,
          description,
        }: {
          name: string;
          description: string;
        }) => {
          return JSON.stringify(await createProject(name, description));
        },
      },
    },
  });

  return result.toDataStreamResponse();
}

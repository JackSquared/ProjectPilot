import {openai} from '@ai-sdk/openai';
import {convertToCoreMessages, streamText} from 'ai';
import {z} from 'zod';
import {createClient} from '@/lib/supabase/server';
import {tryUpdateProject} from '@/lib/projects/queries';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(
  req: Request,
  {params}: {params: {projectId: string}},
) {
  const supabase = createClient();

  async function updateProject(name: string, description: string) {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw 'no user!';
      }

      return tryUpdateProject(
        supabase,
        parseInt(params.projectId),
        name,
        description,
      );
    } catch (error) {
      console.error(error);
    }
  }

  const {messages} = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    tools: {
      updateProject: {
        description: 'Update a project.',
        parameters: z.object({
          name: z.string().describe('The name of the updated project'),
          description: z
            .string()
            .describe('The description of the updated project'),
        }),
        execute: async ({
          name,
          description,
        }: {
          name: string;
          description: string;
        }) => {
          const project = await updateProject(name, description);
          return project?.id;
        },
      },
    },
  });

  return result.toDataStreamResponse();
}

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

  const systemMessage = `You are ProjectPilot, an AI that empowers people to build their ideas.
Create the project as soon as you have a name and description.`;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    system: systemMessage,
    tools: {
      createProject: {
        description: 'Create a new project.',
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
          const project = await createProject(name, description);
          return project?.id;
        },
      },
      openProject: {
        description: 'Open a project. Always open a project after creating it',
        parameters: z.object({
          id: z.string().describe('The id of the project to open'),
        }),
      },
    },
  });

  return result.toDataStreamResponse();
}

import {openai} from '@ai-sdk/openai';
import {convertToCoreMessages, streamText} from 'ai';
import {z} from 'zod';
import {createClient} from '@/lib/supabase/server';
import {tryUpdateProject, tryAddTask} from '@/lib/projects/queries';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(
  req: Request,
  {params}: {params: {projectId: string}},
) {
  const supabase = createClient();

  async function addTask(
    projectId: number,
    title: string,
    description: string | null,
    status: string,
  ) {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw 'no user!';
      }

      return tryAddTask(supabase, projectId, title, description, status);
    } catch (error) {
      console.error(error);
    }
  }

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
          return project;
        },
      },
      addTask: {
        description: 'Add a task to a project.',
        parameters: z.object({
          title: z.string().describe('The title of the task'),
          description: z
            .string()
            .optional()
            .describe('The description of the task'),
          status: z
            .enum(['to do', 'doing', 'done'])
            .describe(
              'The status of the task. If not provided, the task will be added to the "to do" column.',
            ),
        }),
        execute: async ({
          title,
          description,
          status,
        }: {
          title: string;
          description: string;
          status: string;
        }) => {
          const task = await addTask(
            parseInt(params.projectId),
            title,
            description,
            status,
          );
          return task;
        },
      },
    },
  });

  return result.toDataStreamResponse();
}

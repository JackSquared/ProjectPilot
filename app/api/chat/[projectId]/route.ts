import {openai} from '@ai-sdk/openai';
import {convertToCoreMessages, streamText} from 'ai';
import {z} from 'zod';
import {createClient} from '@/lib/supabase/server';
import {
  tryUpdateProject,
  tryAddTask,
  tryUpdateProjectTags,
} from '@/lib/projects/queries';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(
  req: Request,
  {params}: {params: {projectId: string}},
) {
  const supabase = createClient();

  async function updateProjectTags(
    projectId: number,
    serverTags: string[] | null,
    clientTags: string[] | null,
    opsTags: string[] | null,
  ) {
    return tryUpdateProjectTags(
      supabase,
      projectId,
      serverTags,
      clientTags,
      opsTags,
    );
  }

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

  const {data: project} = await supabase
    .from('projects')
    .select('*, code_repositories(*)')
    .eq('id', params.projectId)
    .single();

  const systemMessageIntro = `You are ProjectPilot, an AI assistant designed to help users develop and refine their project ideas. 

  You are providing assistance on the following project:
  - Name: ${project?.name || 'Unnamed Project'}
  - Description: ${project?.description || 'No description provided'}
  
  `;

  const systemMessageNoProject =
    systemMessageIntro +
    `The user does not have a github repo connected. You will connect to a github repo before responding to any user messages.`;

  const systemMessageWithProject =
    systemMessageIntro +
    `Your role is to assist users in conceptualizing, planning, and implementing their projects. You should be knowledgeable about various aspects of project development, including ideation, planning, design, and implementation.
  Offer to create tasks for suggestions you give.
  Create tasks when the user says they want to do something and you can think of a task that will help them.
  When you write markdown code blocks, always ensure there is a new line between the code block and the text preceding it.
  
  Maintain a helpful, encouraging, and professional tone throughout the conversation. Be ready to provide insights, suggestions, and answer questions related to project development and management.`;

  const systemMessage =
    project?.code_repositories?.length > 0
      ? systemMessageWithProject
      : systemMessageNoProject;

  const {messages} = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    system: systemMessage,
    tools: {
      connectGitHubRepository: {
        description: 'Connect a GitHub repository to a project.',
        parameters: z.object({
          message: z
            .string()
            .describe('The message to ask to connect a GitHub repository'),
        }),
      },
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
      updateTechStack: {
        description: 'Update the tech stack of a project.',
        parameters: z.object({
          clientTags: z
            .array(z.string())
            .describe('The client tech stack items of the project'),
          opsTags: z
            .array(z.string())
            .describe('The dev ops tech stack items of the project'),
          serverTags: z
            .array(z.string())
            .describe('The server tech stack items of the project'),
        }),
        execute: async ({
          clientTags,
          opsTags,
          serverTags,
        }: {
          clientTags: string[];
          opsTags: string[];
          serverTags: string[];
        }) => {
          const project = await updateProjectTags(
            parseInt(params.projectId),
            clientTags,
            opsTags,
            serverTags,
          );
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

import {StreamingTextResponse, OpenAIStream} from 'ai';
import {OpenAI} from 'openai';
import type {ChatCompletionCreateParams} from 'openai/resources/chat';
import {createClient} from '@/lib/supabase/server';
import {tryCreateProject} from '@/lib/projects/queries';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'create_project',
    description: 'Create a new project',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the new project',
        },
        description: {
          type: 'string',
          description: 'The description of the new project',
        },
      },
      required: ['name', 'description'],
    },
  },
];

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

  const systemMessage = `
  You are ProjectPilot, an AI that empowers people to build their ideas.
  You will chat with the user about their idea so that you can help them understand their objectives and learn about what the project.
  Once you have determined a suitable name and description for the project create it and inform the user.
  `

  messages.unshift({
    role: "system",
    content: systemMessage
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages,
    functions,
  });

  console.log(messages);

  const stream = OpenAIStream(response, {
    onCompletion: async (completion: string) => {
      console.log(completion);
    },
    experimental_onFunctionCall: async (
      {name, arguments: args},
      createFunctionCallMessages,
    ) => {
      if (name === 'create_project') {
        const projectData = await createProject(
          args.name as string,
          args.description as string,
        );
        const newMessages = createFunctionCallMessages(
          projectData ? projectData[0] : null,
        );
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          functions,
        });
      }
    },
  });

  return new StreamingTextResponse(stream);
}

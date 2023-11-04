import { StreamingTextResponse, OpenAIStream } from 'ai';
import { OpenAI } from 'openai'
import type { ChatCompletionCreateParams } from 'openai/resources/chat';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  async function createProject(name: string, description: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if(!user) {
        throw "no user!"
      }

      let { data, error } = await supabase
        .from('projects')
        .insert([
          { name, description, owner_id: user.id }
      ]).select()
        
      if (error) {
        throw error;
      }
      
      return data
      
    } catch (error) {
      console.error(error);
    }
  }

  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    stream: true,
    messages,
    functions,
  });

  const stream = OpenAIStream(response, {
    onCompletion: async (completion: string) => {
      console.log(completion);
    },
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      if (name === 'create_project') {
        const projectData = await createProject(args.name as string, args.description as string);
        const newMessages = createFunctionCallMessages(projectData ? projectData[0] : null);
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          functions,
        });
      }
    }
  });

  return new StreamingTextResponse(stream);
}

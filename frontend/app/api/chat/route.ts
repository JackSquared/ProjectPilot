import { StreamingTextResponse, OpenAIStream, Message } from 'ai';
import { OpenAI } from 'openai'
import type { ChatCompletionCreateParams } from 'openai/resources/chat';

export const runtime = 'edge';

const KANBAN_URL = "https://kanban.jackdewinter.repl.co"

async function getBoard(board_name: string) {
  try {
    const response = await fetch(`${KANBAN_URL}/board/${board_name}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function createBoard(name: string) {
  try {
    const response = await fetch(`${KANBAN_URL}/board`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
 
const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'get_board',
    description: 'Get a board',
    parameters: {
      type: 'object',
      properties: {
        board_name: {
          type: 'string',
          description: 'The name of the board',
        },
      },
      required: ['board_name'],
    },
  },
  {
    name: 'create_board',
    description: 'Create a new board',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the new board',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'add_column',
    description: 'Add a new column with tasks',
    parameters: {
      type: 'object',
      properties: {
        board_name: {
          type: 'string',
          description: 'The name of the board',
        },
        column_name: {
          type: 'string',
          description: 'The name of the new column',
        },
        tasks: {
          type: 'array',
          description: 'The tasks for the new column',
          items: {
            type: 'object',
            properties: {
              board_name: {
                type: 'string',
                description: 'The name of the board',
              },
              column_name: {
                type: 'string',
                description: 'The name of the column',
              },
              task_title: {
                type: 'string',
                description: 'The title of the new task',
              },
              description: {
                type: 'string',
                description: 'The description of the new task',
              },
            },
            required: ['board_name', 'column_name', 'task_title', 'description'],
          }
        },
      },
      required: ['board_name', 'column_name'],
    },
  },
  {
    name: 'add_task',
    description: 'Add a new task to a column',
    parameters: {
      type: 'object',
      properties: {
        board_name: {
          type: 'string',
          description: 'The name of the board',
        },
        column_name: {
          type: 'string',
          description: 'The name of the column',
        },
        task_title: {
          type: 'string',
          description: 'The title of the new task',
        },
        description: {
          type: 'string',
          description: 'The description of the new task',
        },
      },
      required: ['board_name', 'column_name', 'task_title', 'description'],
    },
  },
];


export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    stream: true,
    messages,
    functions,
  });

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      if (name === 'get_board') {
        const boardData = await getBoard(args.board_name as string);
        const newMessages = createFunctionCallMessages(boardData);
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          functions,
        });
      } else if (name === 'create_board') {
        const boardData = await createBoard(args.name as string);
        const newMessages = createFunctionCallMessages(boardData);
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

import { StreamingTextResponse, LangChainStream, Message } from 'ai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { APIChain } from 'langchain/chains'
import { AIMessage, HumanMessage } from 'langchain/schema';

export const runtime = 'edge';

const docs = `
openapi: 3.0.0
info:
  title: Kanban
  description: |-
    # 🚀 ProjectPilot - Kanban

    Interact with a Kanban project with AI.
  version: 1.0.0
servers:
  - url: https://kanban.jackdewinter.repl.co
paths:
  /board/{board_name}:
    get:
      tags:
        - default
      summary: Get board
      description: Get a board.
      parameters:
        - name: board_name
          in: path
          schema:
            type: string
          required: true
      responses:
        '200':
          description: Successful response
          content:
            application/json: {}
  /board:
    post:
      tags:
        - default
      summary: Create board
      description: Create a new board.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              example: ''
      parameters:
        - name: name
          in: query
          schema:
            type: string
          example: '{{board_name}}'
      responses:
        '200':
          description: Successful response
          content:
            application/json: {}
  /board/{board_name}/column:
    put:
      tags:
        - default
      summary: Add Column
      description: Add a new column with tasks.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              example:
                name: '{{column_name}}'
                tasks: []
      parameters:
        - name: board_name
          in: path
          schema:
            type: string
          required: true
      responses:
        '200':
          description: Successful response
          content:
            application/json: {}
  /board/{board_name}/task:
    put:
      tags:
        - default
      summary: Add Task
      description: Add a new task to a column.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              example:
                title: '{{task_title}}'
                description: '{{description}}'
      parameters:
        - name: column_name
          in: query
          schema:
            type: string
          example: '{{column_name}}'
        - name: board_name
          in: path
          schema:
            type: string
          required: true
      responses:
        '200':
          description: Successful response
          content:
            application/json: {}
`

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  const llm = new ChatOpenAI({
    streaming: true,
  });

  const chain = APIChain.fromLLMAndAPIDocs(llm, docs)

  llm
    .call(
      (messages as Message[]).map(m =>
        m.role == 'user'
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      ),
      {},
      [handlers],
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}

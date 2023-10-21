from dotenv import load_dotenv
load_dotenv()

from langchain.llms import OpenAI
from langchain.chains import APIChain
llm = OpenAI(temperature=0)

docs="""
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
"""

chain = APIChain.from_llm_and_api_docs(llm, docs,     headers={
    "Content-Type": "application/json"}, verbose=True)
chain.run('Create a board named JimmilyBillyBoob')
chain.run('Add a new column called to do to the board JimmilyBillyBoob')
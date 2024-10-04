from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from .utils.prompt import ClientMessage, convert_to_openai_messages
from langchain_openai import ChatOpenAI

load_dotenv(".env.local")

app = FastAPI()

class Request(BaseModel):
    messages: List[ClientMessage]


def stream_text(messages: List[ClientMessage], protocol: str = 'data'):
    llm = ChatOpenAI(
        streaming=True,
        verbose=True,
        model="gpt-4o-mini"
    )


    stream = llm.stream(messages)

    if (protocol == 'text'):
        for chunk in stream:
            if chunk.response_metadata.get("finish_reason") == "stop":
                break
            else:
                yield "{text}".format(text=chunk.content)

@app.post("/api/chat")
async def handle_chat_data(request: Request, protocol: str = Query('data')):
    messages = request.messages
    openai_messages = convert_to_openai_messages(messages)

    response = StreamingResponse(stream_text(openai_messages, protocol))
    response.headers['x-vercel-ai-data-stream'] = 'v1'
    return response
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional

app = FastAPI()


class Task(BaseModel):
    title: str
    description: str


class Column(BaseModel):
    name: str
    tasks: List[Task]


class Board(BaseModel):
    columns: List[Column]


# In-memory database
boards = {}


@app.post("/board/", response_model=Dict[str, Board])
def create_board(name: str):
    if name in boards:
        raise HTTPException(status_code=400, detail="Board already exists")
    boards[name] = Board(columns=[])
    return {name: boards[name]}


@app.get("/board/{name}/", response_model=Board)
def read_board(name: str):
    board = boards.get(name)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@app.put("/board/{name}/column/", response_model=Board)
def add_column(name: str, column: Column):
    board = boards.get(name)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    board.columns.append(column)
    return board


@app.put("/board/{name}/task/", response_model=Board)
def add_task(name: str, column_name: str, task: Task):
    board = boards.get(name)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    for column in board.columns:
        if column.name == column_name:
            column.tasks.append(task)
            return board

    raise HTTPException(status_code=404, detail="Column not found")

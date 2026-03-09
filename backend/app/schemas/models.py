from pydantic import BaseModel
from datetime import date

class TodoModel(BaseModel):
    name: str
    description: str
    priority: str
    completed: bool
    deadline: date

class UpdateTodo(BaseModel):
    name: str | None = None
    description: str | None = None
    priority: str | None = None
    completed: bool | None = None
    deadline: date | None = None

class TodoResponse(BaseModel):
    id: int
    name: str
    description: str
    priority: str
    completed: bool
    deadline: date
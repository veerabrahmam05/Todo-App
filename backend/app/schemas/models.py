from pydantic import BaseModel
from datetime import datetime

class TodoModel(BaseModel):
    name: str
    description: str
    priority: str
    completed: bool
    deadline: datetime

class UpdateTodo(BaseModel):
    name: str | None = None
    description: str | None = None
    priority: str | None = None
    completed: bool | None = None
    deadline: datetime | None = None

class TodoResponse(BaseModel):
    id: int
    name: str
    description: str
    priority: str
    completed: bool
    deadline: datetime
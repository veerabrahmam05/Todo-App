from pydantic import BaseModel
from enum import Enum
from datetime import date

class Priority(int, Enum):
    high = 2
    medium = 1
    low = 0

class TodoModel(BaseModel):
    name: str
    description: str
    priority: Priority
    completed: bool
    deadline: date

class UpdateTodo(BaseModel):
    name: str | None = None
    description: str | None = None
    priority: Priority | None = None
    completed: bool | None = None
    deadline: date | None = None

class TodoResponse(BaseModel):
    id: int
    name: str
    description: str
    priority: Priority
    completed: bool
    deadline: date
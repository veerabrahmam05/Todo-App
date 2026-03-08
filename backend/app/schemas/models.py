from pydantic import BaseModel

class TodoModel(BaseModel):
    name: str = ""
    description: str = ""
    priority: str = ""
    deadline: str = ""

class UpdateTodo():
    name: str
    description: str
    priority: str
    deadline: str

class TodoResponse(BaseModel):
    id: int
    name: str
    description: str
    priority: str
    deadline: str
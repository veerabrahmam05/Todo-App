from fastapi import APIRouter, Depends, HTTPException
from app.config.database import get_db
from app.schemas.schemas import Todo
from app.schemas.models import TodoResponse, TodoModel, UpdateTodo
from sqlalchemy.orm import Session
from sqlalchemy import select

router = APIRouter(
    prefix="/todo",
    tags=["todo"]
)

@router.get("/get", response_model=list[TodoResponse])
def get(session: Session = Depends(get_db)):
    """
        Gets all the todos stored in the db
    """
    result = session.execute(select(Todo))
    todos = [row[0] for row in result.all()]

    return todos

@router.post("/create_todo")
def create_todo(todo: TodoModel, session: Session =  Depends(get_db)):
    """
        creates a todo with given data through method's body
    """
    new_todo = Todo(**todo.model_dump())
    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)

    return new_todo

@router.put("/update/{todo_id}")
def update_todo(todo_id: int, todo: UpdateTodo, session: Session = Depends(get_db)):
    """
        update's the mentioned todo by id with the provided info in the method's body
    """
    db_todo = session.get(Todo, todo_id)

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    update_todo = todo.model_dump(exclude_unset=True)
    for key, value in update_todo.items():
        setattr(db_todo, key, value)
    session.commit()
    session.refresh(db_todo)

    return db_todo

@router.delete("/delete/{todo_id}")
def delete_todo(todo_id: int, session: Session = Depends(get_db)):
    """
        delete's the todo mentioned by id
    """
    db_todo = session.get(Todo, todo_id)

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    session.delete(db_todo)
    session.commit()

    return {
        "success": True,
        "message": "todo deleted successfully"
    }
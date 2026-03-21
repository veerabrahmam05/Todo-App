from fastapi import APIRouter, Depends, HTTPException, Query
from app.config.database import get_db
from app.schemas.schemas import Todo
from app.schemas.models import TodoResponse, TodoModel, UpdateTodo, Priority, User
from sqlalchemy.orm import Session
from sqlalchemy import select, asc, desc
from typing import Literal
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/todo",
    tags=["todo"]
)

@router.get("/get", response_model=list[TodoResponse])
def get(
    completed: bool | None = None,
    sort: Literal["high_to_low", "low_to_high"] | None = None,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_db)
    ):
    """
        Gets all the todos stored in the db
    """
    query = select(Todo).where(Todo.user_id == user.id)

    if completed is not None:
        query = query.where(Todo.completed == completed)

    if sort == "low_to_high":
        query = query.order_by(asc(Todo.priority))
    else:
        query = query.order_by(desc(Todo.priority))
    
    result = session.execute(query)
    todos = [row[0] for row in result.all()]

    return todos

@router.post("/create_todo")
def create_todo(todo: TodoModel, user: User = Depends(get_current_user), session: Session =  Depends(get_db)):
    """
        creates a todo with given data through method's body
    """
    user_todo = todo.model_dump()
    user_todo.update({"user_id": user.id})
    new_todo = Todo(**todo.model_dump())
    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)

    return new_todo

@router.put("/update/{todo_id}")
def update_todo(todo_id: int, todo: UpdateTodo, user: User = Depends(get_current_user), session: Session = Depends(get_db)):
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
def delete_todo(todo_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_db)):
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
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, Date, Boolean

class Base(DeclarativeBase):
    pass

class Todo(Base):
    __tablename__="todo"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)
    priority = Column(String)
    completed = Column(Boolean)
    deadline = Column(Date)
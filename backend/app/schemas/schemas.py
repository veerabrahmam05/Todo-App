from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Column, Integer, String, Date, Boolean, Date, ForeignKey

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__="user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    todos = relationship("Todo", back_populates="user")

class Todo(Base):
    __tablename__="todo"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    name = Column(String)
    description = Column(String)
    priority = Column(Integer)
    completed = Column(Boolean)
    deadline = Column(Date)

    user = relationship("User", back_populates="todos")
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.schemas.schemas import Base

DATABASE_URL = "postgresql://postgres:Brahmam1026$@localhost:5432/todo"

engine = create_engine(url=DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import ResponseValidationError
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config.database import create_tables
from app.routes import todo

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

app.include_router(todo.router)

@app.exception_handler(ResponseValidationError)
async def response_validation_exception_handler(req: Request, e: ResponseValidationError):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Response validation failed",
            "errors": e.errors()
        }
    )
import os
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from datetime import timedelta, datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.config.database import get_db
from app.schemas.schemas import User as UserSchema
from app.schemas.models import TokenData, Token, User, UserInDB

router = APIRouter(
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_IN_MINUTES = 30

password_hash = PasswordHash.recommended()
DUMMY_HASH_PASSWORD = password_hash.hash("dummypassword")

def verify_password(plain_password, password):
    return password_hash.verify(plain_password, password)

def hash_password(password: str):
    return password_hash.hash(password)

def get_user(session: Session, username: str):
    query = select(UserSchema).where(UserSchema.username == username)

    return session.execute(query).scalar_one_or_none()

def authenticate_user(session: Session, username: str, password: str):
    user = get_user(session, username)
    if not user:
        verify_password(password, DUMMY_HASH_PASSWORD)
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_db)):
    credentials_error = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Could not validate Credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        username = payload.get("sub")
        if not username:
            raise credentials_error
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_error
    user = get_user(session, username=token_data.username)
    if user is None:
        raise credentials_error
    return user
    

@router.post("/token", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Session = Depends(get_db)):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires_in = timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires_in)

    return Token(access_token=access_token, token_type="Bearer")

@router.get("/user/me")
async def user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user:
        return True
    else:
        return False

@router.post("/user/sign-up")
async def sign_up(userData: UserInDB, session = Depends(get_db)):
    hashed_password = hash_password(userData.password)
    new_user = UserSchema(username=userData.username, email=userData.email,  password=hashed_password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user


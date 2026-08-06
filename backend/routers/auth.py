from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db import models
from backend.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Auth & Users"])

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if db_user:
        return db_user
    
    new_user = models.User(
        name=user.name,
        phone=user.phone,
        pin=user.pin or user.phone[-4:],
        role=user.role or "STUDENT",
        total_time_remaining=120 # Default 2 free hours
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login-pin", response_model=UserResponse)
def login_with_pin(phone: str, pin: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if not user or user.pin != pin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="전화번호 또는 PIN 번호가 일치하지 않습니다."
        )
    return user

@router.get("/users", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

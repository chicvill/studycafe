import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db import models
from backend.schemas import SeatResponse, SeatAssign

router = APIRouter(prefix="/api/seats", tags=["Seats"])

@router.get("/", response_model=list[SeatResponse])
def get_all_seats(db: Session = Depends(get_db)):
    seats = db.query(models.Seat).all()
    # Seed default 20 seats if empty
    if not seats:
        for i in range(1, 21):
            zone = "MANAGED" if i <= 5 else ("FOCUS" if i <= 12 else "NORMAL")
            s = models.Seat(seat_number=f"A-{i:02d}", zone_type=zone, status="EMPTY")
            db.add(s)
        db.commit()
        seats = db.query(models.Seat).all()
    return seats

@router.post("/assign", response_model=SeatResponse)
def assign_seat(payload: SeatAssign, db: Session = Depends(get_db)):
    seat = db.query(models.Seat).filter(models.Seat.seat_number == payload.seat_number).first()
    if not seat:
        raise HTTPException(status_code=404, detail="좌석을 찾을 수 없습니다.")
    
    if seat.status == "OCCUPIED" and seat.current_user_id != payload.user_id:
        raise HTTPException(status_code=400, detail="이미 다른 사용자가 이용 중인 좌석입니다.")
    
    seat.status = "OCCUPIED"
    seat.current_user_id = payload.user_id
    seat.occupied_since = datetime.datetime.utcnow()
    db.commit()
    db.refresh(seat)
    return seat

@router.post("/leave/{seat_number}", response_model=SeatResponse)
def checkout_seat(seat_number: str, db: Session = Depends(get_db)):
    seat = db.query(models.Seat).filter(models.Seat.seat_number == seat_number).first()
    if not seat:
        raise HTTPException(status_code=404, detail="좌석을 찾을 수 없습니다.")
    
    seat.status = "EMPTY"
    seat.current_user_id = None
    seat.occupied_since = None
    db.commit()
    db.refresh(seat)
    return seat

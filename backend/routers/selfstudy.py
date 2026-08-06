import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db import models
from backend.schemas import (
    SelfStudySessionCreate, SelfStudySessionResponse, AIQuestionRequest
)
from backend.services.ai_engine import ai_engine

router = APIRouter(prefix="/api/selfstudy", tags=["Side Module: SelfStudy AI Care"])

@router.post("/session/start", response_model=SelfStudySessionResponse)
def start_study_session(payload: SelfStudySessionCreate, db: Session = Depends(get_db)):
    session = models.SelfStudySession(
        user_id=payload.user_id,
        subject=payload.subject,
        start_time=datetime.datetime.utcnow(),
        focus_score=100.0
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/session/stop/{session_id}", response_model=SelfStudySessionResponse)
def stop_study_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(models.SelfStudySession).filter(models.SelfStudySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")

    session.end_time = datetime.datetime.utcnow()
    duration_mins = int((session.end_time - session.start_time).total_seconds() / 60)
    session.ai_summary = f"[{session.subject}] 총 {duration_mins}분 학습 진행 완료 (평균 몰입도: {session.focus_score:.1f}점)"
    db.commit()
    db.refresh(session)
    return session

@router.post("/ask-ai")
def ask_ai_study_helper(payload: AIQuestionRequest):
    answer = ai_engine.ask_ai_study_assistant(
        question=payload.question,
        subject=payload.context_subject or "일반"
    )
    return {
        "user_id": payload.user_id,
        "question": payload.question,
        "subject": payload.context_subject,
        "answer": answer
    }

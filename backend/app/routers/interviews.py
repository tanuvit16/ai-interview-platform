# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from datetime import datetime
# from typing import List
# from app.database import get_db
# from app.models import Interview, InterviewStatus, User
# from app.schemas import InterviewCreate, InterviewOut
# from app.auth import get_current_user

# router = APIRouter(prefix="/api/interviews", tags=["interviews"])

# @router.post("/", response_model=InterviewOut)
# def create_interview(data: InterviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     interview = Interview(recruiter_id=current_user.id, candidate_email=data.candidate_email, title=data.title, job_role=data.job_role)
#     db.add(interview)
#     db.commit()
#     db.refresh(interview)
#     return interview

# # @router.get("/", response_model=List[InterviewOut])
# # def list_interviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
# #     return db.query(Interview).filter(Interview.recruiter_id == current_user.id).all()


# @router.get("/", response_model=List[InterviewOut])
# def list_interviews(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if current_user.role.value == "recruiter":
#         return db.query(Interview).filter(Interview.recruiter_id == current_user.id).all()
#     else:
#         return db.query(Interview).filter(Interview.candidate_email == current_user.email).all()
    
# @router.get("/{interview_id}", response_model=InterviewOut)
# def get_interview(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     interview = db.query(Interview).filter(Interview.id == interview_id).first()
#     if not interview:
#         raise HTTPException(status_code=404, detail="Interview not found")
#     return interview

# @router.patch("/{interview_id}/start", response_model=InterviewOut)
# def start_interview(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     interview = db.query(Interview).filter(Interview.id == interview_id).first()
#     if not interview:
#         raise HTTPException(status_code=404, detail="Not found")
#     interview.status = InterviewStatus.in_progress
#     interview.started_at = datetime.utcnow()
#     db.commit()
#     db.refresh(interview)
#     return interview

# @router.patch("/{interview_id}/end", response_model=InterviewOut)
# def end_interview(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     interview = db.query(Interview).filter(Interview.id == interview_id).first()
#     if not interview:
#         raise HTTPException(status_code=404, detail="Not found")
#     interview.status = InterviewStatus.completed
#     interview.ended_at = datetime.utcnow()
#     db.commit()
#     db.refresh(interview)
#     return interview























from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models import Interview, InterviewStatus, User
from app.schemas import InterviewCreate, InterviewOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/interviews", tags=["interviews"])

@router.post("/", response_model=InterviewOut)
def create_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can create interviews")
    interview = Interview(
        recruiter_id=current_user.id,
        candidate_email=data.candidate_email,
        candidate_name=data.candidate_name,
        title=data.title,
        job_role=data.job_role,
        scheduled_date=data.scheduled_date,
        scheduled_time=data.scheduled_time,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

@router.get("/", response_model=List[InterviewOut])
def list_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value == "recruiter":
        return db.query(Interview).filter(Interview.recruiter_id == current_user.id).all()
    else:
        return db.query(Interview).filter(Interview.candidate_email == current_user.email).all()

@router.get("/{interview_id}", response_model=InterviewOut)
def get_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@router.patch("/{interview_id}/start", response_model=InterviewOut)
def start_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Not found")
    interview.status = InterviewStatus.in_progress
    interview.started_at = datetime.utcnow()
    db.commit()
    db.refresh(interview)
    return interview

@router.patch("/{interview_id}/end", response_model=InterviewOut)
def end_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Not found")
    interview.status = InterviewStatus.completed
    interview.ended_at = datetime.utcnow()
    db.commit()
    db.refresh(interview)
    return interview
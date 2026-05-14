from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import UserRole, InterviewStatus, QuestionType

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.candidate

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class InterviewCreate(BaseModel):
    candidate_email: EmailStr
    title: str
    job_role: str

class InterviewOut(BaseModel):
    id: str
    title: str
    job_role: str
    candidate_email: str
    status: InterviewStatus
    created_at: datetime
    class Config:
        from_attributes = True

class QuestionOut(BaseModel):
    id: str
    text: str
    question_type: QuestionType
    order_index: int
    class Config:
        from_attributes = True

class GenerateQuestionsRequest(BaseModel):
    job_role: str
    num_coding: int = 2
    num_technical: int = 2
    num_hr: int = 1

class AnswerSubmit(BaseModel):
    question_id: str
    transcript: Optional[str] = None
    code: Optional[str] = None

class AnswerOut(BaseModel):
    id: str
    score: Optional[float]
    feedback: Optional[str]
    class Config:
        from_attributes = True

class ReportOut(BaseModel):
    id: str
    interview_id: str
    total_score: Optional[float]
    summary: Optional[str]
    strengths: Optional[str]
    weaknesses: Optional[str]
    recommendation: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True
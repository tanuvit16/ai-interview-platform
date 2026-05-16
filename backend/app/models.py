# from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Enum
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.database import Base
# import uuid
# import enum

# def gen_uuid():
#     return str(uuid.uuid4())

# class UserRole(str, enum.Enum):
#     candidate = "candidate"
#     recruiter = "recruiter"

# class InterviewStatus(str, enum.Enum):
#     scheduled = "scheduled"
#     in_progress = "in_progress"
#     completed = "completed"

# class QuestionType(str, enum.Enum):
#     coding = "coding"
#     hr = "hr"
#     technical = "technical"

# class User(Base):
#     __tablename__ = "users"
#     id = Column(String, primary_key=True, default=gen_uuid)
#     email = Column(String, unique=True, nullable=False, index=True)
#     hashed_password = Column(String, nullable=False)
#     full_name = Column(String, nullable=False)
#     role = Column(Enum(UserRole), default=UserRole.candidate)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     interviews_as_recruiter = relationship("Interview", foreign_keys="Interview.recruiter_id", back_populates="recruiter")
#     interviews_as_candidate = relationship("Interview", foreign_keys="Interview.candidate_id", back_populates="candidate")

# class Interview(Base):
#     __tablename__ = "interviews"
#     id = Column(String, primary_key=True, default=gen_uuid)
#     recruiter_id = Column(String, ForeignKey("users.id"), nullable=False)
#     candidate_id = Column(String, ForeignKey("users.id"), nullable=True)
#     candidate_email = Column(String, nullable=False)
#     title = Column(String, nullable=False)
#     job_role = Column(String, nullable=False)
#     status = Column(Enum(InterviewStatus), default=InterviewStatus.scheduled)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     started_at = Column(DateTime(timezone=True), nullable=True)
#     ended_at = Column(DateTime(timezone=True), nullable=True)
#     recruiter = relationship("User", foreign_keys=[recruiter_id], back_populates="interviews_as_recruiter")
#     candidate = relationship("User", foreign_keys=[candidate_id], back_populates="interviews_as_candidate")
#     questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")
#     report = relationship("Report", back_populates="interview", uselist=False)

# class Question(Base):
#     __tablename__ = "questions"
#     id = Column(String, primary_key=True, default=gen_uuid)
#     interview_id = Column(String, ForeignKey("interviews.id"), nullable=False)
#     text = Column(Text, nullable=False)
#     question_type = Column(Enum(QuestionType), default=QuestionType.technical)
#     order_index = Column(Integer, default=0)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     interview = relationship("Interview", back_populates="questions")
#     answer = relationship("Answer", back_populates="question", uselist=False)

# class Answer(Base):
#     __tablename__ = "answers"
#     id = Column(String, primary_key=True, default=gen_uuid)
#     question_id = Column(String, ForeignKey("questions.id"), nullable=False)
#     transcript = Column(Text, nullable=True)
#     code = Column(Text, nullable=True)
#     score = Column(Float, nullable=True)
#     feedback = Column(Text, nullable=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     question = relationship("Question", back_populates="answer")

# class Report(Base):
#     __tablename__ = "reports"
#     id = Column(String, primary_key=True, default=gen_uuid)
#     interview_id = Column(String, ForeignKey("interviews.id"), nullable=False, unique=True)
#     total_score = Column(Float, nullable=True)
#     summary = Column(Text, nullable=True)
#     strengths = Column(Text, nullable=True)
#     weaknesses = Column(Text, nullable=True)
#     recommendation = Column(String, nullable=True)
#     pdf_url = Column(String, nullable=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     interview = relationship("Interview", back_populates="report")
















from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum

def gen_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    candidate = "candidate"
    recruiter = "recruiter"

class InterviewStatus(str, enum.Enum):
    scheduled = "scheduled"
    in_progress = "in_progress"
    completed = "completed"

class QuestionType(str, enum.Enum):
    coding = "coding"
    hr = "hr"
    technical = "technical"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.candidate)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    interviews_as_recruiter = relationship("Interview", foreign_keys="Interview.recruiter_id", back_populates="recruiter")
    interviews_as_candidate = relationship("Interview", foreign_keys="Interview.candidate_id", back_populates="candidate")

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(String, primary_key=True, default=gen_uuid)
    recruiter_id = Column(String, ForeignKey("users.id"), nullable=False)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=True)
    candidate_email = Column(String, nullable=False)
    candidate_name = Column(String, nullable=True, default="Candidate")
    title = Column(String, nullable=False)
    job_role = Column(String, nullable=False)
    scheduled_date = Column(String, nullable=True)
    scheduled_time = Column(String, nullable=True)
    status = Column(Enum(InterviewStatus), default=InterviewStatus.scheduled)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    recruiter = relationship("User", foreign_keys=[recruiter_id], back_populates="interviews_as_recruiter")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="interviews_as_candidate")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")
    report = relationship("Report", back_populates="interview", uselist=False)

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=gen_uuid)
    interview_id = Column(String, ForeignKey("interviews.id"), nullable=False)
    text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionType), default=QuestionType.technical)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    interview = relationship("Interview", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(String, primary_key=True, default=gen_uuid)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    transcript = Column(Text, nullable=True)
    code = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    question = relationship("Question", back_populates="answer")

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, default=gen_uuid)
    interview_id = Column(String, ForeignKey("interviews.id"), nullable=False, unique=True)
    total_score = Column(Float, nullable=True)
    summary = Column(Text, nullable=True)
    strengths = Column(Text, nullable=True)
    weaknesses = Column(Text, nullable=True)
    recommendation = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    interview = relationship("Interview", back_populates="report")
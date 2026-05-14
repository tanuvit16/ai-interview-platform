from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Interview, Question, Answer, Report, User
from app.schemas import ReportOut
from app.auth import get_current_user
from app.services.ai_service import generate_report_summary

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.post("/generate/{interview_id}", response_model=ReportOut)
def generate_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    questions = db.query(Question).filter(Question.interview_id == interview_id).all()
    if not questions:
        raise HTTPException(status_code=400, detail="No questions found")
    qa_pairs, scores = [], []
    for q in questions:
        answer = db.query(Answer).filter(Answer.question_id == q.id).first()
        if answer:
            qa_pairs.append({"question": q.text, "answer": answer.transcript or answer.code or "", "score": answer.score or 0})
            if answer.score is not None:
                scores.append(answer.score)
    if not qa_pairs:
        raise HTTPException(status_code=400, detail="No answers submitted yet")
    total_score = round(sum(scores) / len(scores), 2) if scores else 0
    summary_data = generate_report_summary(job_role=interview.job_role, qa_pairs=qa_pairs)
    report = db.query(Report).filter(Report.interview_id == interview_id).first()
    if report:
        report.total_score = total_score
        report.summary = summary_data.get("summary")
        report.strengths = summary_data.get("strengths")
        report.weaknesses = summary_data.get("weaknesses")
        report.recommendation = summary_data.get("recommendation")
    else:
        report = Report(interview_id=interview_id, total_score=total_score, summary=summary_data.get("summary"), strengths=summary_data.get("strengths"), weaknesses=summary_data.get("weaknesses"), recommendation=summary_data.get("recommendation"))
        db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/{interview_id}", response_model=ReportOut)
def get_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.interview_id == interview_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
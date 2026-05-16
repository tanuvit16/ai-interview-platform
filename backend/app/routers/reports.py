# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database import get_db
# from app.models import Interview, Question, Answer, Report, User
# from app.schemas import ReportOut
# from app.auth import get_current_user
# from app.services.ai_service import generate_report_summary

# router = APIRouter(prefix="/api/reports", tags=["reports"])

# @router.post("/generate/{interview_id}", response_model=ReportOut)
# def generate_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     interview = db.query(Interview).filter(Interview.id == interview_id).first()
#     if not interview:
#         raise HTTPException(status_code=404, detail="Interview not found")
#     questions = db.query(Question).filter(Question.interview_id == interview_id).all()
#     if not questions:
#         raise HTTPException(status_code=400, detail="No questions found")
#     qa_pairs, scores = [], []
#     for q in questions:
#         answer = db.query(Answer).filter(Answer.question_id == q.id).first()
#         if answer:
#             qa_pairs.append({"question": q.text, "answer": answer.transcript or answer.code or "", "score": answer.score or 0})
#             if answer.score is not None:
#                 scores.append(answer.score)
#     if not qa_pairs:
#         raise HTTPException(status_code=400, detail="No answers submitted yet")
#     total_score = round(sum(scores) / len(scores), 2) if scores else 0
#     summary_data = generate_report_summary(job_role=interview.job_role, qa_pairs=qa_pairs)
#     report = db.query(Report).filter(Report.interview_id == interview_id).first()
#     if report:
#         report.total_score = total_score
#         report.summary = summary_data.get("summary")
#         report.strengths = summary_data.get("strengths")
#         report.weaknesses = summary_data.get("weaknesses")
#         report.recommendation = summary_data.get("recommendation")
#     else:
#         report = Report(interview_id=interview_id, total_score=total_score, summary=summary_data.get("summary"), strengths=summary_data.get("strengths"), weaknesses=summary_data.get("weaknesses"), recommendation=summary_data.get("recommendation"))
#         db.add(report)
#     db.commit()
#     db.refresh(report)
#     return report

# @router.get("/{interview_id}", response_model=ReportOut)
# def get_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     report = db.query(Report).filter(Report.interview_id == interview_id).first()
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
#     return report

















from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from app.database import get_db
from app.models import Interview, Question, Answer, Report, User
from app.schemas import ReportOut
from app.auth import get_current_user
from app.services.ai_service import generate_report_summary
from app.services.pdf_service import generate_scorecard_pdf

router = APIRouter(prefix="/api/reports", tags=["reports"])

REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

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
        report = Report(
            interview_id=interview_id,
            total_score=total_score,
            summary=summary_data.get("summary"),
            strengths=summary_data.get("strengths"),
            weaknesses=summary_data.get("weaknesses"),
            recommendation=summary_data.get("recommendation"),
        )
        db.add(report)
    db.commit()
    db.refresh(report)

    # Generate PDF
    pdf_path = os.path.join(REPORTS_DIR, f"{interview_id}.pdf")
    generate_scorecard_pdf(
        report_data={
            "total_score": report.total_score,
            "summary": report.summary,
            "strengths": report.strengths,
            "weaknesses": report.weaknesses,
            "recommendation": report.recommendation,
        },
        interview_data={
            "job_role": interview.job_role,
            "title": interview.title,
            "candidate_email": interview.candidate_email,
        },
        output_path=pdf_path
    )
    report.pdf_url = f"/api/reports/download/{interview_id}"
    db.commit()
    db.refresh(report)
    return report

@router.get("/download/{interview_id}")
def download_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pdf_path = os.path.join(REPORTS_DIR, f"{interview_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found. Generate report first.")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"interview-report-{interview_id[:8]}.pdf"
    )

@router.get("/{interview_id}", response_model=ReportOut)
def get_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.interview_id == interview_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
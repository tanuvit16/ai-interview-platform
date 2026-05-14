from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import tempfile, os
from app.database import get_db
from app.models import Interview, Question, Answer, User
from app.schemas import GenerateQuestionsRequest, QuestionOut, AnswerSubmit, AnswerOut
from app.auth import get_current_user
from app.services.ai_service import generate_questions, evaluate_answer, transcribe_audio

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.post("/generate/{interview_id}", response_model=List[QuestionOut])
def generate_for_interview(interview_id: str, data: GenerateQuestionsRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    db.query(Question).filter(Question.interview_id == interview_id).delete()
    db.commit()
    raw_questions = generate_questions(job_role=data.job_role, num_coding=data.num_coding, num_technical=data.num_technical, num_hr=data.num_hr)
    created = []
    for q in raw_questions:
        question = Question(interview_id=interview_id, text=q["text"], question_type=q["question_type"], order_index=q["order_index"])
        db.add(question)
        created.append(question)
    db.commit()
    for q in created:
        db.refresh(q)
    return created

@router.get("/{interview_id}", response_model=List[QuestionOut])
def get_questions(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Question).filter(Question.interview_id == interview_id).order_by(Question.order_index).all()

@router.post("/answer", response_model=AnswerOut)
def submit_answer(data: AnswerSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = db.query(Question).filter(Question.id == data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    answer_text = data.transcript or data.code or ""
    if not answer_text.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty")
    result = evaluate_answer(question_text=question.text, question_type=question.question_type, answer_text=answer_text)
    answer = db.query(Answer).filter(Answer.question_id == data.question_id).first()
    if answer:
        answer.transcript = data.transcript
        answer.code = data.code
        answer.score = result["score"]
        answer.feedback = result["feedback"]
    else:
        answer = Answer(question_id=data.question_id, transcript=data.transcript, code=data.code, score=result["score"], feedback=result["feedback"])
        db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

@router.post("/transcribe")
async def transcribe_voice(audio: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name
    try:
        text = transcribe_audio(tmp_path)
        return {"transcript": text}
    finally:
        os.unlink(tmp_path)
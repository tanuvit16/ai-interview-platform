import requests
from app.config import settings
import json

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def _ask(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2000,
    }
    response = requests.post(GROQ_URL, headers=headers, json=payload)
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"].strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0]
    elif "```" in content:
        content = content.split("```")[1].split("```")[0]
    content = content.strip()
    if not content.startswith("{") and not content.startswith("["):
        start = content.find("{")
        if start == -1:
            start = content.find("[")
        if start != -1:
            content = content[start:]
    return content.strip()

def generate_questions(job_role: str, num_coding: int = 2, num_technical: int = 2, num_hr: int = 1) -> list:
    prompt = f"""You are an expert technical interviewer. Generate interview questions for a {job_role} position.
Generate exactly: {num_coding} coding questions, {num_technical} technical questions, {num_hr} HR questions.
Return ONLY a JSON array. Each item must have:
- "text": the question string
- "question_type": one of "coding", "technical", "hr"
- "order_index": integer starting from 0
Return only JSON, no extra text."""
    try:
        return json.loads(_ask(prompt))
    except json.JSONDecodeError:
        return [
            {"text": f"Explain the core concepts of {job_role}.", "question_type": "technical", "order_index": 0},
            {"text": f"Write a function to reverse a string.", "question_type": "coding", "order_index": 1},
            {"text": "Tell me about a challenging project you worked on.", "question_type": "hr", "order_index": 2},
        ]

def evaluate_answer(question_text: str, question_type: str, answer_text: str) -> dict:
    prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.
Question ({question_type}): {question_text}
Candidate's answer: {answer_text}
Return ONLY a JSON object with:
- "score": float from 0 to 10
- "feedback": 2-3 sentence constructive feedback
Return only JSON, no extra text."""
    try:
        return json.loads(_ask(prompt))
    except json.JSONDecodeError:
        return {"score": 5.0, "feedback": "Answer received. Please provide more detail for accurate evaluation."}

def generate_report_summary(job_role: str, qa_pairs: list) -> dict:
    qa_text = "\n".join([f"Q: {item['question']}\nA: {item['answer']}\nScore: {item['score']}/10" for item in qa_pairs])
    prompt = f"""You are a senior recruiter reviewing a completed interview for a {job_role} position.
{qa_text}
Return ONLY a JSON object with exactly these four keys:
- "summary": overall 3-4 sentence assessment as a plain string
- "strengths": 2-3 key strengths as a plain string
- "weaknesses": 2-3 areas for improvement as a plain string
- "recommendation": exactly one of these values: "Strong Hire", "Hire", "Maybe", "No Hire"
Return only the raw JSON object. No markdown, no backticks, no extra text."""
    try:
        return json.loads(_ask(prompt))
    except json.JSONDecodeError:
        return {
            "summary": "The candidate completed the interview. Further review recommended.",
            "strengths": "Completed all interview questions.",
            "weaknesses": "Some answers lacked depth and detail.",
            "recommendation": "Maybe"
        }

def transcribe_audio(audio_file_path: str) -> str:
    return "Voice transcription requires a paid API. Please type your answer."





# import requests
# from app.config import settings
# import json

# def _ask(prompt: str) -> str:
#     url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key={settings.OPENAI_API_KEY}"
#     payload = {
#         "contents": [{"parts": [{"text": prompt}]}]
#     }
#     response = requests.post(url, json=payload)
#     response.raise_for_status()
#     data = response.json()
#     content = data["candidates"][0]["content"]["parts"][0]["text"].strip()
#     if content.startswith("```"):
#         content = content.split("```")[1]
#         if content.startswith("json"):
#             content = content[4:]
#     return content.strip()

# def generate_questions(job_role: str, num_coding: int = 2, num_technical: int = 2, num_hr: int = 1) -> list:
#     prompt = f"""You are an expert technical interviewer. Generate interview questions for a {job_role} position.
# Generate exactly: {num_coding} coding questions, {num_technical} technical questions, {num_hr} HR questions.
# Return ONLY a JSON array. Each item must have:
# - "text": the question string
# - "question_type": one of "coding", "technical", "hr"
# - "order_index": integer starting from 0
# Return only JSON, no extra text."""
#     return json.loads(_ask(prompt))

# def evaluate_answer(question_text: str, question_type: str, answer_text: str) -> dict:
#     prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.
# Question ({question_type}): {question_text}
# Candidate's answer: {answer_text}
# Return ONLY a JSON object with:
# - "score": float from 0 to 10
# - "feedback": 2-3 sentence constructive feedback
# Return only JSON, no extra text."""
#     return json.loads(_ask(prompt))

# def generate_report_summary(job_role: str, qa_pairs: list) -> dict:
#     qa_text = "\n".join([f"Q: {item['question']}\nA: {item['answer']}\nScore: {item['score']}/10" for item in qa_pairs])
#     prompt = f"""You are a senior recruiter reviewing a completed interview for a {job_role} position.
# {qa_text}
# Return ONLY a JSON object with:
# - "summary": 3-4 sentence overall assessment
# - "strengths": 2-3 key strengths
# - "weaknesses": 2-3 areas for improvement
# - "recommendation": one of "Strong Hire", "Hire", "Maybe", "No Hire"
# Return only JSON, no extra text."""
#     return json.loads(_ask(prompt))

# def transcribe_audio(audio_file_path: str) -> str:
#     return "Voice transcription requires a paid API. Please type your answer."
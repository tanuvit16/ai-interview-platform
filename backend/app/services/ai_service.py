# # from openai import OpenAI
# # from app.config import settings
# # import json

# # client = OpenAI(api_key=settings.OPENAI_API_KEY)

# # def generate_questions(job_role: str, num_coding: int = 2, num_technical: int = 2, num_hr: int = 1) -> list:
# #     prompt = f"""You are an expert technical interviewer. Generate interview questions for a {job_role} position.
# # Generate exactly: {num_coding} coding questions, {num_technical} technical questions, {num_hr} HR questions.
# # Return ONLY a JSON array. Each item must have:
# # - "text": the question string
# # - "question_type": one of "coding", "technical", "hr"
# # - "order_index": integer starting from 0
# # Return only JSON, no extra text."""
# #     response = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], temperature=0.7, max_tokens=1000)
# #     content = response.choices[0].message.content.strip()
# #     if content.startswith("```"):
# #         content = content.split("```")[1]
# #         if content.startswith("json"):
# #             content = content[4:]
# #     return json.loads(content.strip())

# # def evaluate_answer(question_text: str, question_type: str, answer_text: str) -> dict:
# #     prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.
# # Question ({question_type}): {question_text}
# # Candidate's answer: {answer_text}
# # Return ONLY a JSON object with:
# # - "score": float from 0 to 10
# # - "feedback": 2-3 sentence constructive feedback
# # Return only JSON."""
# #     response = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], temperature=0.3, max_tokens=300)
# #     content = response.choices[0].message.content.strip()
# #     if content.startswith("```"):
# #         content = content.split("```")[1]
# #         if content.startswith("json"):
# #             content = content[4:]
# #     return json.loads(content.strip())

# # def generate_report_summary(job_role: str, qa_pairs: list) -> dict:
# #     qa_text = "\n".join([f"Q: {item['question']}\nA: {item['answer']}\nScore: {item['score']}/10" for item in qa_pairs])
# #     prompt = f"""You are a senior recruiter reviewing a completed interview for a {job_role} position.
# # {qa_text}
# # Return ONLY a JSON object with:
# # - "summary": 3-4 sentence overall assessment
# # - "strengths": 2-3 key strengths
# # - "weaknesses": 2-3 areas for improvement
# # - "recommendation": one of "Strong Hire", "Hire", "Maybe", "No Hire"
# # Return only JSON."""
# #     response = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], temperature=0.4, max_tokens=500)
# #     content = response.choices[0].message.content.strip()
# #     if content.startswith("```"):
# #         content = content.split("```")[1]
# #         if content.startswith("json"):
# #             content = content[4:]
# #     return json.loads(content.strip())

# # def transcribe_audio(audio_file_path: str) -> str:
# #     with open(audio_file_path, "rb") as audio_file:
# #         transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
# #     return transcript.text







# # import google.generativeai as genai
# # from app.config import settings
# # import json

# # genai.configure(api_key=settings.OPENAI_API_KEY)
# # model = genai.GenerativeModel("gemini-1.5-flash")

# # def _ask(prompt: str) -> str:
# #     response = model.generate_content(prompt)
# #     content = response.text.strip()
# #     if content.startswith("```"):
# #         content = content.split("```")[1]
# #         if content.startswith("json"):
# #             content = content[4:]
# #     return content.strip()

# # def generate_questions(job_role: str, num_coding: int = 2, num_technical: int = 2, num_hr: int = 1) -> list:
# #     prompt = f"""You are an expert technical interviewer. Generate interview questions for a {job_role} position.
# # Generate exactly: {num_coding} coding questions, {num_technical} technical questions, {num_hr} HR questions.
# # Return ONLY a JSON array. Each item must have:
# # - "text": the question string
# # - "question_type": one of "coding", "technical", "hr"
# # - "order_index": integer starting from 0
# # Return only JSON, no extra text."""
# #     return json.loads(_ask(prompt))

# # def evaluate_answer(question_text: str, question_type: str, answer_text: str) -> dict:
# #     prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.
# # Question ({question_type}): {question_text}
# # Candidate's answer: {answer_text}
# # Return ONLY a JSON object with:
# # - "score": float from 0 to 10
# # - "feedback": 2-3 sentence constructive feedback
# # Return only JSON, no extra text."""
# #     return json.loads(_ask(prompt))

# # def generate_report_summary(job_role: str, qa_pairs: list) -> dict:
# #     qa_text = "\n".join([f"Q: {item['question']}\nA: {item['answer']}\nScore: {item['score']}/10" for item in qa_pairs])
# #     prompt = f"""You are a senior recruiter reviewing a completed interview for a {job_role} position.
# # {qa_text}
# # Return ONLY a JSON object with:
# # - "summary": 3-4 sentence overall assessment
# # - "strengths": 2-3 key strengths
# # - "weaknesses": 2-3 areas for improvement
# # - "recommendation": one of "Strong Hire", "Hire", "Maybe", "No Hire"
# # Return only JSON, no extra text."""
# #     return json.loads(_ask(prompt))

# # def transcribe_audio(audio_file_path: str) -> str:
# #     return "Voice transcription requires a paid API. Please type your answer."






# from google import genai
# from app.config import settings
# import json

# client = genai.Client(api_key=settings.OPENAI_API_KEY)

# def _ask(prompt: str) -> str:
#     response = client.models.generate_content(
#         model="gemini-1.5-flash",
#         contents=prompt
#     )
#     content = response.text.strip()
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





import requests
from app.config import settings
import json

def _ask(prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key={settings.OPENAI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    content = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    return content.strip()

def generate_questions(job_role: str, num_coding: int = 2, num_technical: int = 2, num_hr: int = 1) -> list:
    prompt = f"""You are an expert technical interviewer. Generate interview questions for a {job_role} position.
Generate exactly: {num_coding} coding questions, {num_technical} technical questions, {num_hr} HR questions.
Return ONLY a JSON array. Each item must have:
- "text": the question string
- "question_type": one of "coding", "technical", "hr"
- "order_index": integer starting from 0
Return only JSON, no extra text."""
    return json.loads(_ask(prompt))

def evaluate_answer(question_text: str, question_type: str, answer_text: str) -> dict:
    prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.
Question ({question_type}): {question_text}
Candidate's answer: {answer_text}
Return ONLY a JSON object with:
- "score": float from 0 to 10
- "feedback": 2-3 sentence constructive feedback
Return only JSON, no extra text."""
    return json.loads(_ask(prompt))

def generate_report_summary(job_role: str, qa_pairs: list) -> dict:
    qa_text = "\n".join([f"Q: {item['question']}\nA: {item['answer']}\nScore: {item['score']}/10" for item in qa_pairs])
    prompt = f"""You are a senior recruiter reviewing a completed interview for a {job_role} position.
{qa_text}
Return ONLY a JSON object with:
- "summary": 3-4 sentence overall assessment
- "strengths": 2-3 key strengths
- "weaknesses": 2-3 areas for improvement
- "recommendation": one of "Strong Hire", "Hire", "Maybe", "No Hire"
Return only JSON, no extra text."""
    return json.loads(_ask(prompt))

def transcribe_audio(audio_file_path: str) -> str:
    return "Voice transcription requires a paid API. Please type your answer."
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, interviews, questions, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Interview Platform", version="1.0.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(interviews.router)
app.include_router(questions.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"message": "AI Interview Platform API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
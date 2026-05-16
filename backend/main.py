# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.database import engine, Base
# from app.routers import auth, interviews, questions, reports

# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="AI Interview Platform", version="1.0.0")

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth.router)
# app.include_router(interviews.router)
# app.include_router(questions.router)
# app.include_router(reports.router)

# @app.get("/")
# def root():
#     return {"message": "AI Interview Platform API is running"}

# @app.get("/health")
# def health():
#     return {"status": "ok"}










from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.routers import auth, interviews, questions, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Interview Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"},
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
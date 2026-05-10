from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, chat_router, mood_router, assessment_router

app = FastAPI(
    title="MindEase API",
    description="AI-powered mental health support platform for students",
    version="1.0.0"
)

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router.router)
app.include_router(chat_router.router)
app.include_router(mood_router.router)
app.include_router(assessment_router.router)

@app.get("/")
def root():
    return {"message": "MindEase API is running", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "ok"}

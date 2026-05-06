from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import test_connection
from app.routes.scraper import router as scraper_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 AgriFlow AI Service starting...")
    test_connection()
    yield
    print("👋 AgriFlow AI Service shutting down...")

app = FastAPI(
    title="AgriFlow AI Service",
    description="ML inference service untuk AgriFlow AI",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper_router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "agriflow-ai", "version": "1.0.0"}

@app.get("/health/db")
async def health_db():
    try:
        test_connection()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
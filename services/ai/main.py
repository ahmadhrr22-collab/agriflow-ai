from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.core.database import test_connection
from app.routes.scraper          import router as scraper_router
from app.routes.insights         import router as insights_router
from app.routes.forecasts        import router as forecasts_router
from app.routes.anomalies        import router as anomalies_router
from app.routes.recommendations  import router as recommendations_router

scheduler = AsyncIOScheduler(timezone="Asia/Jakarta")

async def daily_scrape_job():
    """Job harian — scrape PIHPS jam 08.00 WIB."""
    from app.services.pihps_scraper import scrape_pihps_today
    print("⏰ Daily scrape job started...")
    result = await scrape_pihps_today()
    print(f"✅ Daily scrape done: {result}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 AgriFlow AI Service starting...")
    test_connection()

    # Setup scheduler
    scheduler.add_job(
        daily_scrape_job,
        CronTrigger(hour=8, minute=0, timezone="Asia/Jakarta"),
        id="daily_pihps_scrape",
        replace_existing=True,
    )
    scheduler.start()
    print("⏰ Scheduler started — daily scrape at 08.00 WIB")

    yield

    scheduler.shutdown()
    print("👋 AgriFlow AI Service shutting down...")

app = FastAPI(
    title="AgriFlow AI Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://localhost:3000",
        "https://agriflow-ai.vercel.app",
        "https://agriflow-lkmv2hw11-ahmadhrr22-collabs-projects.vercel.app",
        "https://agriflow-nnrhj2w6b-ahmadhrr22-collabs-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper_router,         prefix="/api/v1")
app.include_router(insights_router,        prefix="/api/v1")
app.include_router(forecasts_router,       prefix="/api/v1")
app.include_router(anomalies_router,       prefix="/api/v1")
app.include_router(recommendations_router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {
        "status":    "ok",
        "service":   "agriflow-ai",
        "version":   "1.0.0",
        "scheduler": "running" if scheduler.running else "stopped",
    }

@app.get("/health/db")
async def health_db():
    try:
        test_connection()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.get("/scheduler/jobs")
async def get_jobs():
    """Lihat scheduled jobs yang aktif."""
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id":       job.id,
            "name":     job.name,
            "next_run": str(job.next_run_time),
            "trigger":  str(job.trigger),
        })
    return {"jobs": jobs}
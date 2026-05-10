from fastapi import APIRouter, BackgroundTasks
from app.services.pihps_scraper import (
    scrape_pihps_today,
    scrape_pihps_historical,
    fetch_pihps,
)
from app.core.database import SessionLocal
from sqlalchemy import text
from datetime import datetime, date, timedelta
import random

router = APIRouter(prefix="/scraper", tags=["scraper"])

@router.post("/run")
async def run_scraper(background_tasks: BackgroundTasks):
    """Scrape PIHPS untuk hari ini (background)."""
    async def job():
        result = await scrape_pihps_today()
        print(f"✅ PIHPS done: {result}")
    background_tasks.add_task(job)
    return {"message": "PIHPS scraping started for today"}

@router.post("/pihps-historical")
async def pihps_historical(days: int = 30):
    """Scrape data historis PIHPS (blocking — tunggu selesai)."""
    result = await scrape_pihps_historical(days)
    return result

@router.get("/test")
async def test_pihps():
    """Test koneksi ke PIHPS API."""
    from datetime import date
    data = await fetch_pihps(7, date.today())
    return {
        "source":        "PIHPS Bank Indonesia",
        "commodity":     "Cabai Merah (ID: 7)",
        "date":          str(date.today()),
        "total_records": len(data),
        "sample":        data[:3] if data else [],
    }

@router.post("/seed-historical")
async def seed_historical_data(days: int = 30):
    """Fallback: generate dummy data kalau PIHPS tidak tersedia."""
    db    = SessionLocal()
    saved = 0
    try:
        commodities = db.execute(
            text("SELECT id, name FROM commodities")
        ).fetchall()
        regions = db.execute(
            text("SELECT id, name FROM regions")
        ).fetchall()

        base_prices = {
            "cabai-merah":  35000,
            "bawang-merah": 30000,
            "beras-medium": 13000,
            "telur-ayam":   28000,
            "minyak-goreng": 15000,
        }

        today = date.today()
        for offset in range(days, 0, -1):
            target = datetime.now() - timedelta(days=offset)
            for commodity in commodities:
                base     = base_prices.get(commodity.name, 20000)
                trend    = offset * (-100)
                seasonal = 1500 * (0.5 + 0.5 * ((offset % 7) / 7))
                base_day = base + trend + seasonal

                for region in regions:
                    variation = random.uniform(-0.08, 0.10)
                    noise     = random.uniform(-0.02, 0.02)
                    price     = max(base_day * (1 + variation + noise), base * 0.7)

                    existing = db.execute(
                        text("""
                            SELECT id FROM price_records
                            WHERE "commodityId" = :cid
                            AND   "regionId"    = :rid
                            AND   DATE("recordedAt") = :d
                        """),
                        {"cid": commodity.id, "rid": region.id, "d": target.date()}
                    ).fetchone()
                    if existing:
                        continue

                    db.execute(
                        text("""
                            INSERT INTO price_records
                                (id, "commodityId", "regionId", price, source,
                                 "confidenceScore", "recordedAt", "createdAt")
                            VALUES
                                (gen_random_uuid(), :cid, :rid, :price,
                                 'KEMENTAN', 0.80, :recorded_at, NOW())
                        """),
                        {
                            "cid":         commodity.id,
                            "rid":         region.id,
                            "price":       round(price, 0),
                            "recorded_at": target,
                        }
                    )
                    saved += 1

        db.commit()
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

    return {"message": "✅ Dummy data seeded", "records_saved": saved, "days": days}
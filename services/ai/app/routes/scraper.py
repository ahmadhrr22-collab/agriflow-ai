from fastapi import APIRouter, BackgroundTasks
from app.services.scraper import scrape_kementan_prices, save_prices_to_db
from app.core.database import SessionLocal
from sqlalchemy import text
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/scraper", tags=["scraper"])

@router.post("/run")
async def run_scraper(background_tasks: BackgroundTasks):
    async def job():
        prices = await scrape_kementan_prices()
        saved  = await save_prices_to_db(prices)
        print(f"✅ Scraping selesai: {saved} records saved")
    background_tasks.add_task(job)
    return {"message": "Scraping dimulai di background"}

@router.get("/test")
async def test_scraper():
    prices = await scrape_kementan_prices()
    return {
        "total_records": len(prices),
        "sample": dict(list(prices.items())[:5]),
    }

@router.post("/seed-historical")
async def seed_historical_data(days: int = 30):
    """
    Generate historical price data untuk development.
    Simulasi data 30 hari ke belakang.
    """
    db = SessionLocal()
    saved = 0

    try:
        # Ambil semua commodity dan region
        commodities = db.execute(text("SELECT id, name FROM commodities")).fetchall()
        regions     = db.execute(text("SELECT id, name, province FROM regions")).fetchall()

        base_prices = {
            "cabai-merah":  35000,
            "bawang-merah": 30000,
            "beras-medium": 13000,
        }

        for day_offset in range(days, 0, -1):
            target_date = datetime.now() - timedelta(days=day_offset)

            for commodity in commodities:
                base = base_prices.get(commodity.name, 30000)

                # Trend naik gradual + noise
                trend     = day_offset * (-150)
                seasonal  = 2000 * (0.5 + 0.5 * ((day_offset % 7) / 7))
                base_day  = base + trend + seasonal

                for region in regions:
                    # Variasi per region
                    region_var = random.uniform(-0.08, 0.10)
                    daily_noise = random.uniform(-0.02, 0.02)
                    price = base_day * (1 + region_var + daily_noise)
                    price = max(price, base * 0.7)

                    # Cek existing
                    existing = db.execute(
                        text("""
                            SELECT id FROM price_records
                            WHERE "commodityId" = :cid
                            AND "regionId" = :rid
                            AND DATE("recordedAt") = :target_date
                        """),
                        {
                            "cid": commodity.id,
                            "rid": region.id,
                            "target_date": target_date.date(),
                        }
                    ).fetchone()

                    if existing:
                        continue

                    db.execute(
                        text("""
                            INSERT INTO price_records
                                (id, "commodityId", "regionId", price, source,
                                 "confidenceScore", "recordedAt", "createdAt")
                            VALUES
                                (gen_random_uuid(), :cid, :rid, :price, :source,
                                 :confidence, :recorded_at, NOW())
                        """),
                        {
                            "cid":         commodity.id,
                            "rid":         region.id,
                            "price":       round(price, 0),
                            "source":      "KEMENTAN",
                            "confidence":  0.80,
                            "recorded_at": target_date,
                        }
                    )
                    saved += 1

        db.commit()

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

    return {
        "message": f"✅ Historical data seeded",
        "records_saved": saved,
        "days": days,
    }
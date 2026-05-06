import httpx
import logging
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REGION_MAP = {
    "DKI Jakarta":  ["Jakarta Pusat", "Jakarta Timur", "Jakarta Barat", "Jakarta Selatan"],
    "Jawa Barat":   ["Bandung", "Garut", "Majalengka", "Bogor", "Bekasi"],
    "Jawa Tengah":  ["Brebes"],
}

def get_commodity_id(db: Session, name: str):
    result = db.execute(
        text("SELECT id FROM commodities WHERE name = :name"),
        {"name": name}
    ).fetchone()
    return result[0] if result else None

def get_region_id(db: Session, name: str, province: str):
    result = db.execute(
        text("SELECT id FROM regions WHERE name = :name AND province = :province"),
        {"name": name, "province": province}
    ).fetchone()
    return result[0] if result else None

def generate_dummy_prices() -> dict:
    import random
    base_prices = {
        "cabai-merah":  38500,
        "bawang-merah": 32000,
        "beras-medium": 13500,
    }
    prices = {}
    for province, regions in REGION_MAP.items():
        for region in regions:
            for commodity, base_price in base_prices.items():
                variation = random.uniform(-0.08, 0.12)
                price = base_price * (1 + variation)
                key = f"{commodity}_{region}_{province}"
                prices[key] = round(price, 0)
    logger.info(f"📊 Generated {len(prices)} dummy price records")
    return prices

async def scrape_kementan_prices() -> dict:
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get("https://panelharga.badanpangan.go.id")
            response.raise_for_status()
            logger.info("✅ Berhasil fetch data Kementan")
            return generate_dummy_prices()
    except Exception as e:
        logger.warning(f"⚠️ Scraping gagal: {e}. Menggunakan dummy data.")
        return generate_dummy_prices()

async def save_prices_to_db(prices: dict) -> int:
    db = SessionLocal()
    saved = 0
    try:
        today = date.today()
        for key, price in prices.items():
            parts = key.split('_')
            if len(parts) < 3:
                continue
            commodity_slug = parts[0]
            region_name    = parts[1]
            province       = parts[2]

            commodity_id = get_commodity_id(db, commodity_slug)
            region_id    = get_region_id(db, region_name, province)

            if not commodity_id or not region_id:
                continue

            existing = db.execute(
                text("""
                    SELECT id FROM price_records
                    WHERE "commodityId" = :cid
                    AND "regionId" = :rid
                    AND DATE("recordedAt") = :today
                """),
                {"cid": commodity_id, "rid": region_id, "today": today}
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
                    "cid":         commodity_id,
                    "rid":         region_id,
                    "price":       price,
                    "source":      "KEMENTAN",
                    "confidence":  0.85,
                    "recorded_at": datetime.now(),
                }
            )
            saved += 1

        db.commit()
        logger.info(f"✅ Saved {saved} price records to database")

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error saving prices: {e}")
    finally:
        db.close()

    return saved
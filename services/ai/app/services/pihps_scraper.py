import httpx
import asyncio
from datetime import datetime, date, timedelta
from sqlalchemy import text
from app.core.database import SessionLocal
import logging

logger = logging.getLogger(__name__)

BASE_URL = "https://www.bi.go.id/hargapangan/WebSite/Home"

# Mapping komoditas AgriFlow → PIHPS
COMMODITY_MAPPING = {
    "cabai-merah": {
        "pihps_ids": [7],   # parent ID, bukan sub-ID
        "name":      "Cabai Merah",
    },
    "bawang-merah": {
        "pihps_ids": [5],   # parent ID
        "name":      "Bawang Merah",
    },
    "beras-medium": {
        "pihps_ids": [1],   # parent ID
        "name":      "Beras Medium",
    },
    "telur-ayam": {
        "pihps_ids": [4],   # parent ID
        "name":      "Telur Ayam",
    },
    "minyak-goreng": {
        "pihps_ids": [9],   # parent ID
        "name":      "Minyak Goreng",
    },
}

# Mapping PIHPS province_id → nama region AgriFlow
PROVINCE_MAPPING = {
    1:  "Aceh",
    2:  "Sumatera Utara",
    3:  "Sumatera Barat",
    4:  "Riau",
    5:  "Kepulauan Riau",
    6:  "Jambi",
    7:  "Bengkulu",
    8:  "Sumatera Selatan",
    9:  "Kepulauan Bangka Belitung",
    10: "Lampung",
    11: "Banten",
    12: "Jawa Barat",
    13: "DKI Jakarta",
    14: "Jawa Tengah",
    15: "DI Yogyakarta",
    16: "Jawa Timur",
    17: "Bali",
    18: "Nusa Tenggara Barat",
    19: "Nusa Tenggara Timur",
    20: "Kalimantan Barat",
    21: "Kalimantan Selatan",
    22: "Kalimantan Tengah",
    23: "Kalimantan Timur",
    24: "Kalimantan Utara",
    25: "Gorontalo",
    26: "Sulawesi Selatan",
    27: "Sulawesi Tenggara",
    28: "Sulawesi Tengah",
    29: "Sulawesi Utara",
    30: "Sulawesi Barat",
    31: "Maluku",
    32: "Maluku Utara",
    33: "Papua",
    34: "Papua Barat",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer":    "https://www.bi.go.id/hargapangan",
    "Accept":     "application/json, text/javascript, */*",
}

async def fetch_pihps(pihps_commodity_id: int, target_date: date) -> list:
    """Fetch satu sub-komoditas dari PIHPS untuk semua provinsi."""
    try:
        month_names = [
            "", "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        # Pastikan tidak ada leading zero di tanggal
        date_str = f"{month_names[target_date.month]} {target_date.day}, {target_date.year}"

        params = {
            "tanggal":   date_str,
            "commodity": pihps_commodity_id,
            "priceType": 1,
            "isPasokan": 1,
            "jenis":     1,
            "periode":   1,
            "provId":    0,
            "_":         int(datetime.now().timestamp() * 1000),
        }

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer":    "https://www.bi.go.id/hargapangan",
            "Accept":     "application/json, text/javascript, */*",
            "X-Requested-With": "XMLHttpRequest",
        }

        async with httpx.AsyncClient(
            timeout=30.0,
            headers=headers,
            follow_redirects=True,
        ) as client:
            res = await client.get(
                f"{BASE_URL}/GetGridData1",
                params=params,
            )
            res.raise_for_status()
            data = res.json().get("data", [])
            logger.info(f"PIHPS {pihps_commodity_id} {date_str}: {len(data)} records")
            return data

    except Exception as e:
        logger.error(f"PIHPS fetch error (id={pihps_commodity_id}, date={target_date}): {e}")
        return []

def get_db_ids(db, commodity_slug: str, region_name: str):
    """Ambil commodity_id dan region_id dari DB."""
    commodity = db.execute(
        text("SELECT id FROM commodities WHERE name = :name"),
        {"name": commodity_slug}
    ).fetchone()

    region = db.execute(
        text("SELECT id FROM regions WHERE name = :name"),
        {"name": region_name}
    ).fetchone()

    return (
        commodity[0] if commodity else None,
        region[0]    if region    else None,
    )

async def scrape_and_save(target_date: date) -> dict:
    """
    Scrape PIHPS untuk satu tanggal, semua komoditas, semua provinsi.
    Kalau ada multiple sub-IDs, ambil rata-rata harganya.
    """
    db    = SessionLocal()
    saved = 0

    try:
        for slug, config in COMMODITY_MAPPING.items():
            # Fetch semua sub-komoditas
            all_records: dict[int, list[float]] = {}

            for pihps_id in config["pihps_ids"]:
                records = await fetch_pihps(pihps_id, target_date)
                for record in records:
                    prov_id = record.get("ProvID")
                    price   = record.get("Nilai")
                    if prov_id and price and price > 0:
                        all_records.setdefault(prov_id, []).append(float(price))
                await asyncio.sleep(0.3)

            if not all_records:
                logger.warning(f"No PIHPS data for {slug} on {target_date}")
                continue

            # Simpan rata-rata per provinsi
            for prov_id, prices in all_records.items():
                region_name = PROVINCE_MAPPING.get(prov_id)
                if not region_name:
                    continue

                avg_price    = sum(prices) / len(prices)
                commodity_id, region_id = get_db_ids(db, slug, region_name)

                if not commodity_id or not region_id:
                    continue

                # Skip kalau sudah ada data PIHPS hari ini
                existing = db.execute(
                    text("""
                        SELECT id FROM price_records
                        WHERE "commodityId" = :cid
                        AND   "regionId"    = :rid
                        AND   DATE("recordedAt") = :d
                        AND   source = 'PIHPS'
                    """),
                    {"cid": commodity_id, "rid": region_id, "d": target_date}
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
                             'PIHPS', 0.92, :recorded_at, NOW())
                    """),
                    {
                        "cid":         commodity_id,
                        "rid":         region_id,
                        "price":       round(avg_price, 0),
                        "recorded_at": datetime.combine(
                            target_date, datetime.min.time()
                        ),
                    }
                )
                saved += 1

            db.commit()
            logger.info(f"✅ {slug} - {target_date} - saved {saved} records")

    except Exception as e:
        db.rollback()
        logger.error(f"scrape_and_save error: {e}")
    finally:
        db.close()

    return {"date": str(target_date), "saved": saved}

async def scrape_pihps_today() -> dict:
    """Scrape data hari ini dari PIHPS."""
    return await scrape_and_save(date.today())

async def scrape_pihps_historical(days: int = 30) -> dict:
    """Scrape data historis N hari ke belakang."""
    today       = date.today()
    total_saved = 0

    for offset in range(days, 0, -1):
        target = today - timedelta(days=offset)
        result = await scrape_and_save(target)
        total_saved += result["saved"]
        logger.info(f"📅 {target} → {result['saved']} records")
        await asyncio.sleep(1)  # jeda antar hari

    return {
        "success":     True,
        "source":      "PIHPS Bank Indonesia",
        "days":        days,
        "total_saved": total_saved,
    }
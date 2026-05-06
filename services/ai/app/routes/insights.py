from fastapi import APIRouter
from app.services.gemini import generate_market_insight
from app.core.database import SessionLocal
from sqlalchemy import text
from pydantic import BaseModel

router = APIRouter(prefix="/insights", tags=["insights"])

class InsightRequest(BaseModel):
    commodity_id: str
    commodity_name: str = "Cabai Merah"

@router.post("/market")
async def get_market_insight(req: InsightRequest):
    """Generate AI insight dari kondisi pasar terkini."""
    db = SessionLocal()

    try:
        # Ambil data terbaru dari DB
        summary = db.execute(
            text("""
                SELECT
                    AVG(price)  as avg_price,
                    MAX(price)  as max_price,
                    MIN(price)  as min_price,
                    MAX(price) - MIN(price) as spread,
                    COUNT(DISTINCT "regionId") as total_regions
                FROM price_records
                WHERE "commodityId" = :cid
                AND "recordedAt" >= NOW() - INTERVAL '2 days'
            """),
            {"cid": req.commodity_id}
        ).fetchone()

        # Ambil region tertinggi dan terendah
        highest = db.execute(
            text("""
                SELECT r.name, pr.price
                FROM price_records pr
                JOIN regions r ON r.id = pr."regionId"
                WHERE pr."commodityId" = :cid
                AND pr."recordedAt" >= NOW() - INTERVAL '2 days'
                ORDER BY pr.price DESC
                LIMIT 1
            """),
            {"cid": req.commodity_id}
        ).fetchone()

        lowest = db.execute(
            text("""
                SELECT r.name, pr.price
                FROM price_records pr
                JOIN regions r ON r.id = pr."regionId"
                WHERE pr."commodityId" = :cid
                AND pr."recordedAt" >= NOW() - INTERVAL '2 days'
                ORDER BY pr.price ASC
                LIMIT 1
            """),
            {"cid": req.commodity_id}
        ).fetchone()

        # Hitung trend 7 hari
        trend_data = db.execute(
            text("""
                SELECT AVG(price) as avg_price, DATE("recordedAt") as date
                FROM price_records
                WHERE "commodityId" = :cid
                AND "recordedAt" >= NOW() - INTERVAL '8 days'
                GROUP BY DATE("recordedAt")
                ORDER BY date ASC
            """),
            {"cid": req.commodity_id}
        ).fetchall()

        trend_7d = "stabil"
        if len(trend_data) >= 2:
            first_price = trend_data[0].avg_price
            last_price  = trend_data[-1].avg_price
            pct_change  = ((last_price - first_price) / first_price) * 100
            if pct_change > 5:
                trend_7d = f"naik {pct_change:.1f}% dalam 7 hari"
            elif pct_change < -5:
                trend_7d = f"turun {abs(pct_change):.1f}% dalam 7 hari"
            else:
                trend_7d = f"relatif stabil (±{abs(pct_change):.1f}%)"

        data = {
            "commodity":      req.commodity_name,
            "avg_price":      float(summary.avg_price or 0),
            "max_price":      float(summary.max_price or 0),
            "min_price":      float(summary.min_price or 0),
            "spread":         float(summary.spread or 0),
            "total_regions":  int(summary.total_regions or 0),
            "highest_region": highest.name if highest else "-",
            "lowest_region":  lowest.name if lowest else "-",
            "anomaly_count":  0,
            "trend_7d":       trend_7d,
        }

        insight = await generate_market_insight(data)
        return {
            "commodity": req.commodity_name,
            "market_data": data,
            "insight": insight["data"],
            "generated_at": "just now",
        }

    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()
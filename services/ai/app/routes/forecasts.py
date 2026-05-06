from fastapi import APIRouter
from app.services.forecasting import generate_forecast
from app.core.database import SessionLocal
from sqlalchemy import text
from pydantic import BaseModel

router = APIRouter(prefix="/forecasts", tags=["forecasts"])

class ForecastRequest(BaseModel):
    commodity_id: str
    region_id:    str
    horizon:      int = 7

@router.post("/generate")
async def get_forecast(req: ForecastRequest):
    """Generate demand forecast menggunakan Prophet + XGBoost ensemble."""
    result = generate_forecast(
        commodity_id=req.commodity_id,
        region_id=req.region_id,
        horizon=req.horizon,
    )
    return result

@router.get("/latest")
async def get_latest_forecasts(commodity_id: str, region_id: str):
    """Ambil forecast terbaru dari database."""
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT
                    "forecastDate",
                    "predictedPrice",
                    "lowerBound",
                    "upperBound",
                    "modelVersion",
                    "mape"
                FROM forecasts
                WHERE "commodityId" = :cid
                AND "regionId"      = :rid
                AND "forecastDate"  >= NOW()
                ORDER BY "forecastDate" ASC
                LIMIT 7
            """),
            {"cid": commodity_id, "rid": region_id}
        ).fetchall()

        return [
            {
                "date":        row[0].strftime('%Y-%m-%d'),
                "predicted":   float(row[1]),
                "lower_bound": float(row[2]),
                "upper_bound": float(row[3]),
                "model":       row[4],
                "mape":        float(row[5]) if row[5] else None,
            }
            for row in rows
        ]
    finally:
        db.close()
from fastapi import APIRouter
from app.services.anomaly import detect_anomalies
from pydantic import BaseModel

router = APIRouter(prefix="/anomalies", tags=["anomalies"])

class AnomalyRequest(BaseModel):
    commodity_id: str
    region_id:    str

@router.post("/detect")
async def detect(req: AnomalyRequest):
    return detect_anomalies(req.commodity_id, req.region_id)

@router.get("/detect")
async def detect_get(commodity_id: str, region_id: str):
    return detect_anomalies(commodity_id, region_id)
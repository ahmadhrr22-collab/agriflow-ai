from fastapi import APIRouter
from app.services.recommendation import generate_recommendations

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/generate")
async def get_recommendations(commodity_id: str, top_n: int = 5):
    return generate_recommendations(commodity_id, top_n)
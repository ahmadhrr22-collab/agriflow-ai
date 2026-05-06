from fastapi import APIRouter, BackgroundTasks
from app.services.scraper import scrape_kementan_prices, save_prices_to_db

router = APIRouter(prefix="/scraper", tags=["scraper"])

@router.post("/run")
async def run_scraper(background_tasks: BackgroundTasks):
    """Trigger manual scraping — untuk testing."""
    async def job():
        prices = await scrape_kementan_prices()
        saved  = await save_prices_to_db(prices)
        print(f"✅ Scraping selesai: {saved} records saved")

    background_tasks.add_task(job)
    return {"message": "Scraping dimulai di background"}

@router.get("/test")
async def test_scraper():
    """Test scraper tanpa simpan ke DB."""
    prices = await scrape_kementan_prices()
    return {
        "total_records": len(prices),
        "sample":        dict(list(prices.items())[:5]),
    }
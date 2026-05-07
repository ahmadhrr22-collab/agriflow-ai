import pandas as pd
from sqlalchemy import text
from app.core.database import SessionLocal
import logging

logger = logging.getLogger(__name__)

def get_latest_prices(commodity_id: str) -> list:
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT
                    pr.price,
                    pr."confidenceScore",
                    r.id         as region_id,
                    r.name       as region_name,
                    r.province,
                    r.latitude,
                    r.longitude
                FROM price_records pr
                JOIN regions r ON r.id = pr."regionId"
                WHERE pr."commodityId" = :cid
                AND pr."recordedAt" >= NOW() - INTERVAL '2 days'
                ORDER BY pr."recordedAt" DESC
            """),
            {"cid": commodity_id}
        ).fetchall()

        # Ambil 1 record terbaru per region
        seen = set()
        result = []
        for row in rows:
            if row.region_id not in seen:
                seen.add(row.region_id)
                result.append({
                    "region_id":       row.region_id,
                    "region_name":     row.region_name,
                    "province":        row.province,
                    "latitude":        row.latitude,
                    "longitude":       row.longitude,
                    "price":           float(row.price),
                    "confidence":      float(row.confidenceScore),
                })
        return result
    finally:
        db.close()

def calculate_recommendation_score(
    origin: dict,
    destination: dict,
    avg_price: float,
) -> dict:
    """
    Score-based ranking untuk rekomendasi distribusi.
    Bukan optimization — lebih explainable dan reliable.
    """
    # Surplus score: origin harga rendah = surplus tinggi
    price_diff     = destination["price"] - origin["price"]
    surplus_score  = max(0, (avg_price - origin["price"]) / avg_price)
    deficit_score  = max(0, (destination["price"] - avg_price) / avg_price)
    price_diff_score = max(0, price_diff / avg_price)

    # Distance penalty (simplified — pakai koordinat)
    lat_diff  = abs(origin["latitude"]  - destination["latitude"])
    lon_diff  = abs(origin["longitude"] - destination["longitude"])
    distance  = (lat_diff ** 2 + lon_diff ** 2) ** 0.5
    distance_penalty = min(distance / 5, 0.4)

    # Composite score
    score = (
        0.30 * surplus_score    +
        0.30 * deficit_score    +
        0.25 * price_diff_score -
        0.15 * distance_penalty
    )
    score = max(0, min(1, score))

    # Build explanation
    reasons = []
    if surplus_score > 0.05:
        reasons.append(
            f"Surplus di {origin['region_name']}: harga {((avg_price - origin['price']) / avg_price * 100):.0f}% di bawah rata-rata"
        )
    if deficit_score > 0.05:
        reasons.append(
            f"Defisit di {destination['region_name']}: harga {((destination['price'] - avg_price) / avg_price * 100):.0f}% di atas rata-rata"
        )
    if price_diff > 2000:
        reasons.append(
            f"Selisih harga Rp {price_diff:,.0f}/kg antar wilayah"
        )
    if not reasons:
        reasons.append("Perbedaan harga moderat antar wilayah")

    return {
        "origin_region_id":   origin["region_id"],
        "origin_name":        origin["region_name"],
        "origin_province":    origin["province"],
        "origin_price":       origin["price"],
        "dest_region_id":     destination["region_id"],
        "dest_name":          destination["region_name"],
        "dest_province":      destination["province"],
        "dest_price":         destination["price"],
        "price_differential": round(price_diff, 0),
        "score":              round(score, 3),
        "surplus_score":      round(surplus_score, 3),
        "deficit_score":      round(deficit_score, 3),
        "distance_penalty":   round(distance_penalty, 3),
        "reasons":            reasons,
        "confidence":         round(min(origin["confidence"], destination["confidence"]), 2),
    }

def generate_recommendations(commodity_id: str, top_n: int = 5) -> dict:
    """Generate top-N distribution recommendations."""
    regions = get_latest_prices(commodity_id)

    if len(regions) < 2:
        return {
            "success": False,
            "error":   "Data tidak cukup untuk generate rekomendasi",
            "recommendations": [],
        }

    prices    = [r["price"] for r in regions]
    avg_price = sum(prices) / len(prices)

    # Generate semua pasangan origin → destination
    all_scores = []
    for origin in regions:
        for dest in regions:
            if origin["region_id"] == dest["region_id"]:
                continue

            # Hanya rekomendasikan jika selisih harga > 1000
            if abs(origin["price"] - dest["price"]) < 1000:
                continue

            # Origin harus lebih murah dari destination
            if origin["price"] >= dest["price"]:
                continue

            score = calculate_recommendation_score(origin, dest, avg_price)
            if score["score"] > 0.05:  # Lower threshold
                all_scores.append(score)

    # Sort by score descending
    all_scores.sort(key=lambda x: x["score"], reverse=True)
    top_recommendations = all_scores[:top_n]

    return {
        "success":         True,
        "total_pairs":     len(all_scores),
        "avg_price":       round(avg_price, 0),
        "regions_analyzed": len(regions),
        "recommendations": top_recommendations,
    }
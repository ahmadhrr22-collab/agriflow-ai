import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sqlalchemy import text
from app.core.database import SessionLocal
import logging

logger = logging.getLogger(__name__)

def get_price_series(commodity_id: str, region_id: str, days: int = 30) -> pd.DataFrame:
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT
                    DATE("recordedAt") as date,
                    AVG(price)         as price
                FROM price_records
                WHERE "commodityId" = :cid
                AND "regionId"      = :rid
                AND "recordedAt" >= NOW() - INTERVAL :days
                GROUP BY DATE("recordedAt")
                ORDER BY date ASC
            """),
            {"cid": commodity_id, "rid": region_id, "days": f"{days} days"}
        ).fetchall()

        if not rows:
            return pd.DataFrame()

        df = pd.DataFrame(rows, columns=['date', 'price'])
        df['date']  = pd.to_datetime(df['date'])
        df['price'] = df['price'].astype(float)
        return df
    finally:
        db.close()

def detect_anomalies(commodity_id: str, region_id: str) -> dict:
    """
    Deteksi anomali menggunakan dua layer:
    1. Statistical (z-score + pct change)
    2. Isolation Forest
    """
    df = get_price_series(commodity_id, region_id, days=30)
    if df.empty or len(df) < 7:
        return {"success": False, "anomalies": [], "error": "Data tidak cukup"}

    df = df.copy()

    # Layer 1: Statistical
    rolling_mean = df['price'].rolling(7, min_periods=3).mean()
    rolling_std  = df['price'].rolling(7, min_periods=3).std()
    df['z_score']     = (df['price'] - rolling_mean) / rolling_std.replace(0, 1)
    df['pct_change_7'] = df['price'].pct_change(7) * 100

    # Layer 2: Isolation Forest
    iso_scores = []
    if len(df) >= 10:
        try:
            features = df[['price']].copy()
            features['pct_change'] = df['price'].pct_change().fillna(0)
            iso = IsolationForest(contamination=0.1, random_state=42)
            iso.fit(features)
            iso_pred   = iso.predict(features)
            iso_scores = iso_pred.tolist()
        except Exception as e:
            logger.warning(f"Isolation Forest error: {e}")
            iso_scores = [1] * len(df)
    else:
        iso_scores = [1] * len(df)

    anomalies = []
    for i, row in df.iterrows():
        z      = abs(row['z_score']) if not pd.isna(row['z_score']) else 0
        pct    = abs(row['pct_change_7']) if not pd.isna(row['pct_change_7']) else 0
        iso_flag = iso_scores[i] == -1 if i < len(iso_scores) else False

        # Trigger jika minimal 2 signal aktif
        signals = sum([z > 2.0, pct > 10, iso_flag])
        if signals >= 2:
            severity = 'critical' if (z > 3.0 or pct > 20) else 'warning'
            direction = 'naik' if row['pct_change_7'] > 0 else 'turun'

            anomalies.append({
                "date":      row['date'].strftime('%Y-%m-%d'),
                "price":     round(float(row['price']), 0),
                "z_score":   round(float(z), 2),
                "pct_change": round(float(row['pct_change_7']), 1),
                "severity":  severity,
                "signals":   signals,
                "explanation": (
                    f"Harga {direction} {abs(row['pct_change_7']):.1f}% "
                    f"dalam 7 hari (z-score: {z:.1f})"
                ),
            })

    return {
        "success":       True,
        "total_anomalies": len(anomalies),
        "anomalies":     anomalies,
        "data_points":   len(df),
        "period_days":   30,
    }
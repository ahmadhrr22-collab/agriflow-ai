import pandas as pd
import numpy as np
from prophet import Prophet
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_percentage_error
from sqlalchemy import text
from app.core.database import SessionLocal
import logging
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

def get_price_data(commodity_id: str, region_id: str, days: int = 60) -> pd.DataFrame:
    """Ambil data historis dari database."""
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT
                    DATE("recordedAt") as ds,
                    AVG(price)         as y
                FROM price_records
                WHERE "commodityId" = :cid
                AND "regionId"      = :rid
                AND "recordedAt" >= NOW() - INTERVAL :days
                GROUP BY DATE("recordedAt")
                ORDER BY ds ASC
            """),
            {
                "cid":  commodity_id,
                "rid":  region_id,
                "days": f"{days} days",
            }
        ).fetchall()

        if not rows:
            return pd.DataFrame()

        df = pd.DataFrame(rows, columns=['ds', 'y'])
        df['ds'] = pd.to_datetime(df['ds'])
        df['y']  = df['y'].astype(float)
        return df

    finally:
        db.close()

def add_features(df: pd.DataFrame) -> pd.DataFrame:
    """Feature engineering untuk XGBoost."""
    df = df.copy()
    df = df.sort_values('ds').reset_index(drop=True)

    # Lag features
    df['lag_1']  = df['y'].shift(1)
    df['lag_7']  = df['y'].shift(7)
    df['lag_14'] = df['y'].shift(14)

    # Rolling statistics
    df['rolling_mean_7']  = df['y'].rolling(7).mean()
    df['rolling_std_7']   = df['y'].rolling(7).std()
    df['rolling_mean_14'] = df['y'].rolling(14).mean()

    # Calendar features
    df['day_of_week'] = df['ds'].dt.dayofweek
    df['week_of_year'] = df['ds'].dt.isocalendar().week.astype(int)
    df['month']       = df['ds'].dt.month
    df['day_of_month'] = df['ds'].dt.day

    # Lebaran approximation (bulan 3-4)
    df['is_lebaran_window'] = df['month'].isin([3, 4]).astype(int)
    df['is_nataru_window']  = df['month'].isin([12, 1]).astype(int)

    return df.dropna()

def train_prophet(df: pd.DataFrame) -> tuple:
    """Train Prophet model sebagai baseline."""
    try:
        prophet_df = df[['ds', 'y']].copy()

        # Indonesian holidays approximation
        lebaran = pd.DataFrame({
            'holiday':      'lebaran',
            'ds':           pd.to_datetime(['2024-04-10', '2025-03-30', '2026-03-20']),
            'lower_window': -14,
            'upper_window': 7,
        })

        model = Prophet(
            holidays=lebaran,
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05,
        )
        model.fit(prophet_df)
        return model, True
    except Exception as e:
        logger.error(f"Prophet training error: {e}")
        return None, False

def train_xgboost(df: pd.DataFrame) -> tuple:
    """Train XGBoost model sebagai main forecaster."""
    try:
        df_feat = add_features(df)
        if len(df_feat) < 10:
            return None, False

        feature_cols = [
            'lag_1', 'lag_7', 'lag_14',
            'rolling_mean_7', 'rolling_std_7', 'rolling_mean_14',
            'day_of_week', 'week_of_year', 'month', 'day_of_month',
            'is_lebaran_window', 'is_nataru_window',
        ]

        X = df_feat[feature_cols]
        y = df_feat['y']

        # Walk-forward validation — 80/20 split
        split    = int(len(X) * 0.8)
        X_train  = X.iloc[:split]
        X_val    = X.iloc[split:]
        y_train  = y.iloc[:split]
        y_val    = y.iloc[split:]

        model = XGBRegressor(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.1,
            subsample=0.8,
            random_state=42,
            verbosity=0,
        )
        model.fit(X_train, y_train)

        # Evaluasi
        mape = 0.0
        if len(X_val) > 0:
            y_pred = model.predict(X_val)
            mape   = mean_absolute_percentage_error(y_val, y_pred) * 100

        return model, mape

    except Exception as e:
        logger.error(f"XGBoost training error: {e}")
        return None, 0.0

def generate_forecast(
    commodity_id: str,
    region_id:    str,
    horizon:      int = 7,
) -> dict:
    """
    Generate 7-day forecast menggunakan Prophet + XGBoost ensemble.
    """
    logger.info(f"Generating forecast for {commodity_id} / {region_id}")

    df = get_price_data(commodity_id, region_id, days=60)
    if df.empty or len(df) < 7:
        return {
            "success": False,
            "error":   "Data tidak cukup untuk forecasting (minimum 7 hari)",
        }

    # Train models
    prophet_model, prophet_ok = train_prophet(df)
    xgb_model, mape           = train_xgboost(df)

    forecasts = []
    last_date  = df['ds'].max()
    last_prices = df['y'].tolist()

    for i in range(1, horizon + 1):
        forecast_date = last_date + pd.Timedelta(days=i)
        predictions   = []

        # Prophet prediction
        if prophet_ok and prophet_model:
            future = pd.DataFrame({'ds': [forecast_date]})
            pf     = prophet_model.predict(future)
            prophet_pred = float(pf['yhat'].iloc[0])
            lower_bound  = float(pf['yhat_lower'].iloc[0])
            upper_bound  = float(pf['yhat_upper'].iloc[0])
            predictions.append(prophet_pred)
        else:
            # Fallback: simple trend
            prophet_pred = last_prices[-1] * 1.002
            lower_bound  = prophet_pred * 0.95
            upper_bound  = prophet_pred * 1.05
            predictions.append(prophet_pred)

        # XGBoost prediction
        if xgb_model is not None and len(last_prices) >= 14:
            feat_dict = {
                'lag_1':             last_prices[-1],
                'lag_7':             last_prices[-7] if len(last_prices) >= 7  else last_prices[-1],
                'lag_14':            last_prices[-14] if len(last_prices) >= 14 else last_prices[-1],
                'rolling_mean_7':    np.mean(last_prices[-7:]),
                'rolling_std_7':     np.std(last_prices[-7:]),
                'rolling_mean_14':   np.mean(last_prices[-14:]),
                'day_of_week':       forecast_date.dayofweek,
                'week_of_year':      forecast_date.isocalendar()[1],
                'month':             forecast_date.month,
                'day_of_month':      forecast_date.day,
                'is_lebaran_window': 1 if forecast_date.month in [3, 4] else 0,
                'is_nataru_window':  1 if forecast_date.month in [12, 1] else 0,
            }
            feat_df  = pd.DataFrame([feat_dict])
            xgb_pred = float(xgb_model.predict(feat_df)[0])
            predictions.append(xgb_pred)

        # Ensemble: rata-rata Prophet + XGBoost
        ensemble_pred = np.mean(predictions)

        # Confidence interval
        spread  = (upper_bound - lower_bound) / 2
        ci_low  = max(ensemble_pred - spread, ensemble_pred * 0.90)
        ci_high = ensemble_pred + spread

        forecasts.append({
            "date":        forecast_date.strftime('%Y-%m-%d'),
            "predicted":   round(ensemble_pred, 0),
            "lower_bound": round(ci_low, 0),
            "upper_bound": round(ci_high, 0),
        })

        last_prices.append(ensemble_pred)

    return {
        "success":      True,
        "horizon_days": horizon,
        "mape":         round(mape, 2),
        "model":        "Prophet + XGBoost Ensemble",
        "forecasts":    forecasts,
        "data_points":  len(df),
    }
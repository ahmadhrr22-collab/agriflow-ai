import google.generativeai as genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel("gemini-3-flash-preview")

async def generate_market_insight(data: dict) -> dict:
    """
    Generate insight narasi dari data supply chain.
    Gemini hanya dipanggil SETELAH ML models menghasilkan output.
    """
    try:
        prompt = f"""
Kamu adalah analis distribusi pangan Indonesia yang berpengalaman.
Berikan insight singkat dan actionable berdasarkan data berikut.

Data Pasar Hari Ini:
- Komoditas: {data.get('commodity', 'Cabai Merah')}
- Harga rata-rata nasional: Rp {data.get('avg_price', 0):,.0f}/kg
- Harga tertinggi: Rp {data.get('max_price', 0):,.0f} di {data.get('highest_region', '-')}
- Harga terendah: Rp {data.get('min_price', 0):,.0f} di {data.get('lowest_region', '-')}
- Spread harga antar wilayah: Rp {data.get('spread', 0):,.0f}
- Jumlah region dipantau: {data.get('total_regions', 0)}
- Anomali terdeteksi: {data.get('anomaly_count', 0)}
- Tren 7 hari: {data.get('trend_7d', 'stabil')}

Instruksi:
1. Berikan ringkasan kondisi pasar dalam 1-2 kalimat
2. Identifikasi 1 risiko utama yang perlu diperhatikan
3. Berikan 1 rekomendasi aksi konkret untuk distributor
4. Gunakan bahasa Indonesia yang profesional tapi mudah dipahami
5. Maksimal 4 kalimat total

Format respons (JSON):
{{
  "summary": "ringkasan kondisi pasar",
  "risk": "risiko utama",
  "recommendation": "rekomendasi aksi",
  "sentiment": "bullish|bearish|neutral"
}}

Respond ONLY with valid JSON, no markdown, no explanation.
"""

        response = model.generate_content(prompt)
        text     = response.text.strip()

        # Clean response
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()

        import json
        result = json.loads(text)
        return {"success": True, "data": result}

    except Exception as e:
        logger.error(f"Gemini error: {e}")
        return {
            "success": False,
            "data": {
                "summary":        "Data pasar sedang dianalisis. Silakan cek kembali dalam beberapa saat.",
                "risk":           "Spread harga antar wilayah perlu dipantau lebih lanjut.",
                "recommendation": "Pantau pergerakan harga di region surplus sebelum mengambil keputusan distribusi.",
                "sentiment":      "neutral",
            }
        }
import Link from 'next/link';

const features = [
  {
    icon: '◉',
    title: 'Heatmap Regional',
    desc: 'Visualisasi distribusi harga per wilayah secara real-time. Identifikasi surplus dan defisit dengan peta interaktif.',
  },
  {
    icon: '◌',
    title: 'Demand Forecast',
    desc: 'Prediksi harga 7 hari ke depan menggunakan ensemble Prophet + XGBoost dengan confidence interval 80%.',
  },
  {
    icon: '◎',
    title: 'Deteksi Anomali',
    desc: 'Deteksi lonjakan harga tidak wajar menggunakan Z-score statistik dan Isolation Forest secara otomatis.',
  },
  {
    icon: '◍',
    title: 'Rekomendasi Distribusi',
    desc: 'Saran pengiriman berbasis skor dari wilayah surplus ke defisit, lengkap dengan penjelasan dan confidence level.',
  },
  {
    icon: '✦',
    title: 'AI Market Insight',
    desc: 'Narasi analisis pasar yang dihasilkan Gemini AI — ringkasan kondisi, risiko, dan rekomendasi aksi dalam bahasa natural.',
  },
  {
    icon: '◆',
    title: 'Alert System',
    desc: 'Early warning otomatis untuk lonjakan harga, potensi shortage, dan pola distribusi tidak normal.',
  },
];

const stats = [
  { value: '10', label: 'Region Dipantau' },
  { value: '3', label: 'Komoditas Aktif' },
  { value: '5.54%', label: 'MAPE Forecast' },
  { value: '85%', label: 'Confidence Score' },
];

const users = [
  {
    role: 'Distributor',
    desc: 'Optimalkan rute distribusi berdasarkan data harga real-time dan rekomendasi AI.',
    icon: '◈',
  },
  {
    role: 'Off-taker & Retailer',
    desc: 'Antisipasi kenaikan harga dengan forecast 7 hari dan alert dini sebelum terjadi kelangkaan.',
    icon: '◉',
  },
  {
    role: 'Analyst & Regulator',
    desc: 'Pantau stabilitas harga nasional, deteksi anomali, dan buat keputusan berbasis data.',
    icon: '◎',
  },
];

export default function LandingPage() {
  return (
    <div
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
      }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#166534' }}
          >
            <span className="text-white font-medium text-sm">AG</span>
          </div>

          <span className="font-medium">AgriFlow AI</span>
        </div>

        <div
          className="flex items-center gap-6 text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <a
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Fitur
          </a>

          <a
            href="#users"
            className="hover:text-foreground transition-colors"
          >
            Pengguna
          </a>

          <a
            href="#stats"
            className="hover:text-foreground transition-colors"
          >
            Data
          </a>
        </div>

        <Link
          href="/login"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#166534' }}
        >
          Masuk ke Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 max-w-5xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{
            background: '#EAF3DE',
            color: '#27500A',
            border: '0.5px solid #C0DD97',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#166534' }}
          ></div>

          Platform Kecerdasan Supply Chain Pangan Indonesia
        </div>

        <h1 className="text-5xl font-medium leading-tight mb-6">
          Distribusi pangan
          <br />
          <span style={{ color: '#166534' }}>
            yang lebih cerdas.
          </span>
        </h1>

        <p
          className="text-lg max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--muted-foreground)' }}
        >
          AgriFlow AI menggabungkan machine learning dan Gemini AI untuk
          memberikan insight distribusi pangan berbasis data — bukan intuisi.
        </p>

        {/* FIXED SECTION */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#166534' }}
          >
            Coba Dashboard →
          </Link>

          <a
            href="#features"
            className="px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{
              border: '0.5px solid var(--border)',
              color: 'var(--foreground)',
            }}
          >
            Lihat Fitur
          </a>
        </div>
      </section>

      {/* Stats */}
      <section
        id="stats"
        className="px-8 py-16"
        style={{ background: '#0A3D1F' }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-medium text-white mb-2">
                {s.value}
              </div>

              <div
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
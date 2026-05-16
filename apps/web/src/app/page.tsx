import Link from 'next/link';

const stats = [
  { value: '34', label: 'Provinsi PIHPS' },
  { value: '5', label: 'Komoditas utama' },
  { value: '08.00', label: 'Update WIB' },
  { value: 'Real', label: 'Data pipeline' },
];

const features = [
  'Heatmap harga regional',
  'Forecast demand 7 hari',
  'Alert anomali harga real',
  'Rekomendasi distribusi',
];

export default function LandingPage() {
  return (
    <main className="min-h-screen ag-shell px-5 py-5">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[10px] border bg-white shadow-2xl" style={{ borderColor: 'var(--border)' }}>
        <nav className="flex items-center justify-between px-7 py-4">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-semibold"
              style={{ background: 'var(--ag-primary)', color: '#fff' }}
            >
              AG
            </div>
            <span className="text-sm font-semibold">AgriFlow AI</span>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-full border bg-white px-2 py-1 text-xs" style={{ borderColor: 'var(--border)' }}>
            {['Home', 'Data', 'Insight', 'Alert'].map((item) => (
              <span key={item} className="rounded-full px-3 py-1.5" style={{ color: 'var(--muted-foreground)' }}>
                {item}
              </span>
            ))}
          </div>

          <Link href="/login" className="ag-button px-4 py-2 text-xs font-semibold">
            Masuk
          </Link>
        </nav>

        <section className="px-7 pb-7">
          <div
            className="relative min-h-[560px] overflow-hidden rounded-[10px]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(255,253,247,0.96) 0%, rgba(255,253,247,0.84) 38%, rgba(15,79,47,0.06) 55%), url(/agriculture-field.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
            }}
          >
            <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full border bg-white/86 px-4 py-2 text-xs font-semibold shadow-sm" style={{ borderColor: 'var(--border)' }}>
              Real-time food supply intelligence
            </div>

            <div className="mx-auto max-w-3xl px-5 pt-24 text-center">
              <div className="ag-chip mx-auto mb-5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--ag-primary)' }} />
                Precision agriculture
              </div>

              <h1 className="text-5xl font-semibold leading-[1.04] tracking-tight">
                The Command Center For Indonesia Food Distribution
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                Monitor harga pangan, deteksi anomali, dan ambil keputusan distribusi
                berdasarkan pipeline data real, bukan asumsi.
              </p>

              <div className="mt-7 flex items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
                  style={{ background: 'var(--ag-primary)' }}
                >
                  Buka Dashboard
                </Link>
                <a href="#features" className="ag-button px-5 py-3 text-sm font-semibold">
                  Lihat Sistem
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-4 border-y" style={{ borderColor: 'var(--border)' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="px-7 py-6">
              <div className="text-3xl font-semibold">{stat.value}</div>
              <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        <section id="features" className="grid grid-cols-[0.9fr_1.1fr] gap-10 px-7 py-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--ag-primary)' }}>
              2026
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              From raw price records to actionable distribution decisions.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={feature} className="ag-soft p-4">
                <div className="text-xs font-semibold" style={{ color: 'var(--ag-primary)' }}>
                  0{index + 1}
                </div>
                <div className="mt-8 text-sm font-semibold">{feature}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

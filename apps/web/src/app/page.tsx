import Link from 'next/link';
import { Map, LineChart, BellRing, Truck } from 'lucide-react';

const stats = [
  { value: '34', label: 'Provinsi PIHPS' },
  { value: '5', label: 'Komoditas utama' },
  { value: '08.00', label: 'Pembaruan WIB' },
  { value: 'Real', label: 'Jalur data' },
];

const features = [
  { title: 'Peta panas harga regional', icon: Map },
  { title: 'Prakiraan permintaan 7 hari', icon: LineChart },
  { title: 'Peringatan anomali harga', icon: BellRing },
  { title: 'Rekomendasi distribusi', icon: Truck },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen ag-shell px-5 py-5">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[10px] border bg-white shadow-2xl" style={{ borderColor: 'var(--border)' }}>
        <nav className="flex items-center justify-between px-7 py-4">
          <div className="flex items-center gap-1">
            <img src="/agriflow-logo.png" alt="Agriflow Logo" className="h-28 w-auto object-contain" />
            <span className="text-xl font-bold -ml-3 -mt-1">Agriflow.</span>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-full border bg-white px-2 py-1 text-xs" style={{ borderColor: 'var(--border)' }}>
            {['Beranda', 'Data', 'Wawasan', 'Peringatan'].map((item) => (
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
            className="relative min-h-[560px] flex flex-col justify-center overflow-hidden rounded-[10px]"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%), url(/agriculture-field.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          >
            <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full border border-white/20 bg-black/20 backdrop-blur-md px-4 py-2 text-xs font-medium text-white shadow-sm">
              Sistem Informasi Pasokan Pangan
            </div>

            <div className="mx-auto max-w-3xl px-5 py-24 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-md mx-auto mb-5 px-3 py-1.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4ade80' }} />
                Pertanian presisi
              </div>

              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-md">
                Pusat Optimasi Distribusi Pangan Indonesia
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-200 drop-shadow">
                Monitor harga pangan, deteksi anomali, dan ambil keputusan distribusi
                berdasarkan pipeline data real, bukan asumsi.
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                  style={{ background: 'var(--ag-primary)' }}
                >
                  Buka Dashboard
                </Link>
                <a href="#features" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20">
                  Lihat Sistem
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-y bg-gray-50/30" style={{ borderColor: 'var(--border)' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center p-8 transition-colors hover:bg-white">
              <div className="text-4xl font-extrabold tracking-tight text-gray-900">{stat.value}</div>
              <div className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-widest text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        <section id="features" className="grid lg:grid-cols-[1fr_1.2fr] gap-12 px-8 py-20 bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex flex-col justify-center pr-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-600 mb-6">
              <span className="h-px w-8 bg-green-600"></span>
              Keunggulan Sistem
            </div>
            <h2 className="text-4xl font-bold leading-tight text-gray-900">
              Dari data harga mentah hingga keputusan distribusi yang tepat sasaran.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-600">
              Platform kami dirancang khusus untuk memecahkan tantangan rantai pasok pangan di Indonesia. Dapatkan visibilitas penuh dan optimalkan setiap pergerakan komoditas dengan cerdas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-50 opacity-50 transition-transform duration-500 group-hover:scale-[2]"></div>
                  <div className="relative mb-4 text-green-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={40} strokeWidth={1.5} />
                  </div>
                  <div className="relative text-lg font-bold text-gray-800 leading-snug">{feature.title}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

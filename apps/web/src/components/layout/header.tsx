'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':                  { title: 'Overview',        subtitle: 'Ringkasan kondisi supply chain hari ini' },
  '/dashboard/heatmap':          { title: 'Heatmap Regional', subtitle: 'Peta distribusi supply & demand per wilayah' },
  '/dashboard/forecast':         { title: 'Demand Forecast', subtitle: 'Prediksi kebutuhan 7 hari ke depan' },
  '/dashboard/anomalies':        { title: 'Deteksi Anomali', subtitle: 'Lonjakan harga dan pola distribusi tidak wajar' },
  '/dashboard/recommendations':  { title: 'Rekomendasi',     subtitle: 'Saran distribusi berdasarkan data terkini' },
  '/dashboard/alerts':           { title: 'Alert Center',    subtitle: 'Notifikasi dan early warning system' },
  '/dashboard/settings':         { title: 'Pengaturan',      subtitle: 'Konfigurasi akun dan preferensi' },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'AgriFlow AI', subtitle: '' };

  return (
    <header className="h-14 flex items-center justify-between px-6 shrink-0" style={{
      borderBottom: '0.5px solid var(--border)',
      background: 'var(--background)',
    }}>
      <div>
        <h1 className="text-sm font-medium">{page.title}</h1>
        <p className="text-xs" style={{color: 'var(--muted-foreground)'}}>{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Last updated */}
        <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
          Diperbarui: <span className="font-medium" style={{color: 'var(--foreground)'}}>2 jam lalu</span>
        </div>

        {/* Commodity selector */}
        <select className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer" style={{
          border: '0.5px solid var(--border)',
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}>
          <option>Cabai Merah</option>
          <option>Bawang Merah</option>
          <option>Beras Medium</option>
        </select>

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg" style={{
          border: '0.5px solid var(--border)',
        }}>
          <span style={{fontSize: '14px'}}>◆</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{background: '#E24B4A'}}></span>
        </button>
      </div>
    </header>
  );
}
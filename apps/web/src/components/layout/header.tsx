'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, { title: string; subtitle: string; eyebrow: string }> = {
  '/dashboard': {
    title: 'Overview',
    subtitle: 'Ringkasan harga, risiko, dan rekomendasi distribusi hari ini',
    eyebrow: 'Command center',
  },
  '/dashboard/heatmap': {
    title: 'Heatmap Regional',
    subtitle: 'Peta distribusi supply dan demand per wilayah',
    eyebrow: 'Regional intelligence',
  },
  '/dashboard/forecast': {
    title: 'Demand Forecast',
    subtitle: 'Prediksi kebutuhan dan harga 7 hari ke depan',
    eyebrow: 'Predictive view',
  },
  '/dashboard/anomalies': {
    title: 'Deteksi Anomali',
    subtitle: 'Lonjakan harga dan pola distribusi tidak wajar',
    eyebrow: 'Risk monitor',
  },
  '/dashboard/recommendations': {
    title: 'Rekomendasi',
    subtitle: 'Saran distribusi berdasarkan data terkini',
    eyebrow: 'Action planner',
  },
  '/dashboard/alerts': {
    title: 'Alert Center',
    subtitle: 'Notifikasi dan early warning system dari data real',
    eyebrow: 'Live warning',
  },
  '/dashboard/settings': {
    title: 'Pengaturan',
    subtitle: 'Konfigurasi akun dan preferensi',
    eyebrow: 'Workspace',
  },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || {
    title: 'AgriFlow AI',
    subtitle: '',
    eyebrow: 'Dashboard',
  };

  return (
    <header
      className="h-[76px] flex items-center justify-between px-7 shrink-0"
      style={{
        background: 'rgba(255, 253, 247, 0.76)',
        borderBottom: '1px solid rgba(230, 224, 210, 0.86)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--ag-primary)' }}>
          {page.eyebrow}
        </div>
        <div className="mt-1 flex items-end gap-3">
          <h1 className="text-xl font-semibold leading-none">{page.title}</h1>
          <p className="hidden md:block text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {page.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

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

  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const today = new Date();
      setFormattedDate(today.toLocaleDateString('id-ID', options));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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

      {pathname === '/dashboard' && mounted && formattedDate && (
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 79, 47, 0.05) 0%, rgba(159, 211, 86, 0.08) 100%)',
            color: 'var(--ag-primary)',
            border: '1px solid rgba(15, 79, 47, 0.12)',
          }}
        >
          <Calendar size={14} className="opacity-95 text-[var(--ag-primary)]" />
          <span>{formattedDate}</span>
        </div>
      )}
    </header>
  );
}

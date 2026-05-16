'use client';

import { useNationalSummary } from '@/hooks/use-prices';
import { useDashboardStore } from '@/store/dashboard.store';

function SkeletonCard() {
  return (
    <div className="ag-card p-4 animate-pulse">
      <div className="h-3 w-24 rounded mb-4" style={{ background: 'var(--muted)' }} />
      <div className="h-8 w-32 rounded mb-3" style={{ background: 'var(--muted)' }} />
      <div className="h-3 w-28 rounded" style={{ background: 'var(--muted)' }} />
    </div>
  );
}

export function MetricCards() {
  const { selectedCommodityId } = useDashboardStore();
  const { data, isLoading, error } = useNationalSummary(selectedCommodityId);

  if (error) {
    return (
      <div
        className="ag-card p-4 text-sm"
        style={{ background: '#FCEBEB', color: '#A32D2D', borderColor: '#F09595' }}
      >
        Gagal memuat data metrik. Pastikan backend berjalan.
      </div>
    );
  }

  if (isLoading || !data || !selectedCommodityId) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Rata-rata Nasional',
      value: `Rp ${data.average.toLocaleString('id-ID')}`,
      meta: `${data.totalRegions} region dipantau`,
      chip: `Spread Rp ${data.spread.toLocaleString('id-ID')}`,
      tone: data.spread > 5000 ? 'risk' : 'good',
      bar: Math.min(100, (data.spread / Math.max(data.average, 1)) * 450),
    },
    {
      label: 'Harga Tertinggi',
      value: `Rp ${data.highest.price.toLocaleString('id-ID')}`,
      meta: data.highest.region,
      chip: `+${Math.round(((data.highest.price - data.average) / data.average) * 100)}% vs rata-rata`,
      tone: 'risk',
      bar: Math.min(100, (data.highest.price / Math.max(data.average, 1)) * 70),
    },
    {
      label: 'Harga Terendah',
      value: `Rp ${data.lowest.price.toLocaleString('id-ID')}`,
      meta: data.lowest.region,
      chip: `-${Math.round(((data.average - data.lowest.price) / data.average) * 100)}% vs rata-rata`,
      tone: 'good',
      bar: Math.min(100, (data.lowest.price / Math.max(data.average, 1)) * 84),
    },
    {
      label: 'Data Points',
      value: `${data.recordCount}`,
      meta: 'Sumber: PIHPS dan Panel Harga',
      chip: 'Confidence 85%',
      tone: 'neutral',
      bar: 85,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const isRisk = metric.tone === 'risk';
        const isGood = metric.tone === 'good';

        return (
          <div key={metric.label} className="ag-card-strong p-4 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--muted-foreground)' }}>
                {metric.label}
              </div>
              <span
                className="h-2 w-2 rounded-full mt-1"
                style={{
                  background: isRisk ? '#E24B4A' : isGood ? '#1f7a4d' : '#EF9F27',
                }}
              />
            </div>

            <div className="mt-3 text-2xl font-bold tracking-tight">{metric.value}</div>
            <div className="mt-1 text-[11px] font-medium truncate" style={{ color: 'var(--muted-foreground)' }}>
              {metric.meta}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{
                  background: isRisk ? '#FCEBEB' : isGood ? '#EAF3DE' : 'var(--muted)',
                  color: isRisk ? '#A32D2D' : isGood ? 'var(--ag-primary)' : 'var(--muted-foreground)',
                }}
              >
                {metric.chip}
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--muted)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${metric.bar}%`,
                  background: isRisk ? '#E24B4A' : isGood ? 'var(--ag-primary)' : '#EF9F27',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

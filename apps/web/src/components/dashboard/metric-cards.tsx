'use client';

import { useNationalSummary } from '@/hooks/use-prices';
import { useDashboardStore }  from '@/store/dashboard.store';

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 animate-pulse" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="h-3 w-24 rounded mb-3" style={{background: 'var(--muted)'}}></div>
      <div className="h-7 w-32 rounded mb-2" style={{background: 'var(--muted)'}}></div>
      <div className="h-3 w-20 rounded" style={{background: 'var(--muted)'}}></div>
    </div>
  );
}

export function MetricCards() {
  const { selectedCommodityId } = useDashboardStore();
  const { data, isLoading, error } = useNationalSummary(selectedCommodityId);

  // 1. TAMPILKAN ERROR: Hanya jika benar-benar ada error dari API
  if (error) {
    console.error("Detail Error Metrik:", error);
    return (
      <div className="p-4 rounded-xl text-sm" style={{
        background: '#FCEBEB',
        color: '#A32D2D',
        border: '0.5px solid #F09595',
      }}>
        Gagal memuat data metrik. Pastikan backend berjalan.
      </div>
    );
  }

  // 2. TAMPILKAN SKELETON: Jika loading, atau ID komoditas belum terpilih, atau data masih kosong
  if (isLoading || !data || !selectedCommodityId) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // 3. RENDER DATA METRIK JIKA SUDAH BERHASIL DIAMBIL
  const metrics = [
    {
      label:       'Harga Rata-rata Nasional',
      value:       `Rp ${data.average.toLocaleString('id-ID')}`,
      delta:       `Rp ${data.spread.toLocaleString('id-ID')}`,
      deltaLabel:  'spread harga',
      trend:       data.spread > 5000 ? 'down' : 'up',
      sub:         `${data.totalRegions} region dipantau`,
    },
    {
      label:       'Harga Tertinggi',
      value:       `Rp ${data.highest.price.toLocaleString('id-ID')}`,
      delta:       data.highest.region,
      deltaLabel:  'region termahal',
      trend:       'down',
      sub:         `+${Math.round(((data.highest.price - data.average) / data.average) * 100)}% vs rata-rata`,
    },
    {
      label:       'Harga Terendah',
      value:       `Rp ${data.lowest.price.toLocaleString('id-ID')}`,
      delta:       data.lowest.region,
      deltaLabel:  'region termurah',
      trend:       'up',
      sub:         `-${Math.round(((data.average - data.lowest.price) / data.average) * 100)}% vs rata-rata`,
    },
    {
      label:       'Data Points',
      value:       `${data.recordCount}`,
      delta:       'confidence',
      deltaLabel:  '85%',
      trend:       'neutral',
      sub:         'Sumber: Panel Harga Kementan',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl p-4" style={{
          background: 'var(--background)',
          border: '0.5px solid var(--border)',
        }}>
          <div className="text-xs mb-3" style={{color: 'var(--muted-foreground)'}}>
            {m.label}
          </div>
          <div className="text-2xl font-medium mb-1">{m.value}</div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{
              background: m.trend === 'up'   ? '#EAF3DE'
                : m.trend === 'down' ? '#FCEBEB'
                : 'var(--muted)',
              color: m.trend === 'up'   ? '#27500A'
                : m.trend === 'down' ? '#A32D2D'
                : 'var(--muted-foreground)',
            }}>
              {m.delta}
            </span>
            <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {m.deltaLabel}
            </span>
          </div>
          <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
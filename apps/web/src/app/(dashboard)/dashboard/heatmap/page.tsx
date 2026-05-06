'use client';

import dynamic            from 'next/dynamic';
import { useState }       from 'react';
import { useHeatmap }     from '@/hooks/use-heatmap';
import { useCommodities } from '@/hooks/use-prices';

const HeatmapMap = dynamic(
  () => import('@/components/map/heatmap-map').then((m) => m.HeatmapMap),
  { ssr: false, loading: () => (
    <div className="h-full flex items-center justify-center text-sm"
      style={{color: 'var(--muted-foreground)'}}>
      Memuat peta...
    </div>
  )}
);

function DeviationLegend() {
  const items = [
    { color: '#E24B4A', label: '> +10% (sangat tinggi)' },
    { color: '#EF9F27', label: '+5% s/d +10% (tinggi)' },
    { color: '#166534', label: 'Normal (±5%)' },
    { color: '#378ADD', label: '-5% s/d -10% (rendah)' },
    { color: '#185FA5', label: '< -10% (sangat rendah)' },
  ];

  return (
    <div className="rounded-xl p-4" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="text-xs font-medium mb-3">
        Deviasi dari rata-rata nasional
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0"
              style={{background: item.color}}></div>
            <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionTable({ regions }: { regions: any[] }) {
  const sorted = [...regions].sort((a, b) => b.deviation - a.deviation);

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="px-4 py-3 text-xs font-medium"
        style={{borderBottom: '0.5px solid var(--border)'}}>
        Detail per Region
      </div>
      <div className="divide-y" style={{borderColor: 'var(--border)'}}>
        {sorted.map((r) => (
          <div key={r.regionId} className="flex items-center justify-between px-4 py-2.5">
            <div>
              <div className="text-xs font-medium">{r.regionName}</div>
              <div className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
                {r.province}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium">
                Rp {r.price.toLocaleString('id-ID')}
              </div>
              <div className="text-xs mt-0.5">
                <span className="px-1.5 py-0.5 rounded-full font-medium" style={{
                  background: r.deviation > 5  ? '#FCEBEB'
                    : r.deviation < -5 ? '#EAF3DE'
                    : 'var(--muted)',
                  color: r.deviation > 5  ? '#A32D2D'
                    : r.deviation < -5 ? '#27500A'
                    : 'var(--muted-foreground)',
                  fontSize: '10px',
                }}>
                  {r.deviation > 0 ? '+' : ''}{r.deviation}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeatmapPage() {
  const { data: commodities }                    = useCommodities();
  const [selectedCommodityId, setSelectedCommodityId] = useState('cmotsnfqt0000ix1oqixddl65');
  const { data: regions, isLoading }             = useHeatmap(selectedCommodityId);

  const selectedCommodity = commodities?.find((c: any) => c.id === selectedCommodityId);

  return (
    <div className="space-y-5">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Heatmap Regional</h2>
          <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
            Distribusi harga per wilayah vs rata-rata nasional
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCommodityId}
            onChange={(e) => setSelectedCommodityId(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{
              border: '0.5px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)',
            }}
          >
            {commodities?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.localName}</option>
            ))}
          </select>
          {!isLoading && regions && (
            <span className="text-xs px-2.5 py-1 rounded-full" style={{
              background: '#EAF3DE',
              color: '#27500A',
            }}>
              {regions.length} region
            </span>
          )}
        </div>
      </div>

      {/* National summary bar */}
      {regions && regions.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Rata-rata Nasional',
              value: `Rp ${regions[0]?.avgNational?.toLocaleString('id-ID')}`,
            },
            {
              label: 'Region Termahal',
              value: [...regions].sort((a, b) => b.price - a.price)[0]?.regionName,
            },
            {
              label: 'Region Termurah',
              value: [...regions].sort((a, b) => a.price - b.price)[0]?.regionName,
            },
            {
              label: 'Komoditas',
              value: selectedCommodity?.localName || '-',
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl px-4 py-3" style={{
              background: 'var(--background)',
              border: '0.5px solid var(--border)',
            }}>
              <div className="text-xs mb-1" style={{color: 'var(--muted-foreground)'}}>
                {item.label}
              </div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-3 gap-5">
        {/* Map */}
        <div className="col-span-2 rounded-xl overflow-hidden" style={{
          height: '480px',
          border: '0.5px solid var(--border)',
        }}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-sm animate-pulse"
              style={{
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
              }}>
              Memuat data heatmap...
            </div>
          ) : (
            <HeatmapMap regions={regions || []} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <DeviationLegend />
          {regions && <RegionTable regions={regions} />}
        </div>
      </div>
    </div>
  );
}
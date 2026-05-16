'use client';

import dynamic            from 'next/dynamic';
import { useState }       from 'react';
import { useHeatmap }     from '@/hooks/use-heatmap';
import { useCommodities } from '@/hooks/use-prices';
import { CustomSelect }   from '@/components/ui/custom-select';

const HeatmapMap = dynamic(
  () => import('@/components/map/heatmap-map').then((m) => m.HeatmapMap),
  { ssr: false, loading: () => (
    <div className="h-full flex items-center justify-center text-sm"
      style={{color: 'var(--muted-foreground)'}}>
      Memuat peta...
    </div>
  )}
);

function DeviationLegend({ commodityName }: { commodityName: string }) {
  return (
    <div className="rounded-xl p-4" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="text-xs font-medium mb-3">
        {commodityName} per KG
      </div>
      <div className="flex w-full h-4 mb-2">
        <div className="flex-[1]" style={{ background: '#48BB78' }}></div>
        <div className="flex-[1]" style={{ background: '#2F855A' }}></div>
        <div className="flex-[1]" style={{ background: '#22543D' }}></div>
        <div className="flex-[1]" style={{ background: '#E53E3E' }}></div>
        <div className="flex-[1]" style={{ background: '#C53030' }}></div>
        <div className="flex-[1]" style={{ background: '#8B0000' }}></div>
        <div className="flex-[1]" style={{ background: '#A0AEC0' }}></div>
        <div className="flex-[1]" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: 'none' }}></div>
      </div>
      <div className="flex w-full text-[10px]" style={{color: 'var(--muted-foreground)'}}>
        <div className="flex-[3] text-left leading-tight">Harga<br/>Terendah</div>
        <div className="flex-[3] text-right leading-tight" style={{paddingRight: '4px'}}>Harga<br/>Tertinggi</div>
        <div className="flex-[1] text-center leading-tight">Tidak<br/>Update</div>
        <div className="flex-[1] text-center leading-tight">Tidak<br/>Ada Data</div>
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
          <CustomSelect
            value={selectedCommodityId}
            onChange={setSelectedCommodityId}
            options={(commodities || []).map((c: any) => ({ id: c.id, label: c.localName }))}
            className="min-w-[150px]"
          />
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
          <DeviationLegend commodityName={selectedCommodity?.localName || 'Komoditas'} />
          {regions && <RegionTable regions={regions} />}
        </div>
      </div>
    </div>
  );
}
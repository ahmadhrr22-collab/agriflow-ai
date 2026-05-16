'use client';

import { useEffect } from 'react';
import { useCommodities } from '@/hooks/use-prices';
import { useDashboardStore } from '@/store/dashboard.store';

type CommodityOption = {
  id: string;
  localName: string;
};

export function DataQualityBanner() {
  const { data: commodities } = useCommodities();
  const { selectedCommodityId, setSelectedCommodityId } = useDashboardStore();

  useEffect(() => {
    if (commodities && commodities.length > 0 && !selectedCommodityId) {
      setSelectedCommodityId(commodities[0].id);
    }
  }, [commodities, selectedCommodityId, setSelectedCommodityId]);

  return (
    <div className="ag-card-strong flex items-center justify-between px-4 py-3 text-sm">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-semibold"
          style={{ background: '#EAF3DE', color: 'var(--ag-primary)' }}
        >
          DB
        </div>
        <div>
          <div className="font-semibold">Data pipeline aktif</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Sumber real: PIHPS Bank Indonesia, Panel Harga, BMKG
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={selectedCommodityId}
          onChange={(event) => setSelectedCommodityId(event.target.value)}
          className="ag-button text-xs px-3 py-2 outline-none cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          {commodities?.map((commodity: CommodityOption) => (
            <option key={commodity.id} value={commodity.id}>
              {commodity.localName}
            </option>
          ))}
        </select>

        <div className="hidden lg:flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span>Confidence</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full" style={{ background: '#DCEBC9' }}>
            <div className="h-full rounded-full" style={{ width: '85%', background: 'var(--ag-primary)' }} />
          </div>
          <span className="font-semibold" style={{ color: 'var(--ag-primary)' }}>85%</span>
        </div>

        <span className="ag-chip px-3 py-1.5">Update 07.00 WIB</span>
      </div>
    </div>
  );
}

'use client';

import { useCommodities, useRegions } from '@/hooks/use-prices';
import { useDashboardStore } from '@/store/dashboard.store';
import { Database } from 'lucide-react';
import { CustomSelect } from '@/components/ui/custom-select';

type CommodityOption = {
  id: string;
  localName: string;
};

export function DataQualityBanner() {
  const { data: commodities } = useCommodities();
  const { data: regions } = useRegions();
  const { selectedCommodityId, setSelectedCommodityId, selectedRegionId, setSelectedRegionId } = useDashboardStore();

  useEffect(() => {
    if (commodities && commodities.length > 0 && !selectedCommodityId) {
      setSelectedCommodityId(commodities[0].id);
    }
  }, [commodities, selectedCommodityId, setSelectedCommodityId]);

  useEffect(() => {
    if (regions && regions.length > 0 && !selectedRegionId) {
      const jakarta = regions.find((r: any) => r.name === 'Jakarta Pusat');
      setSelectedRegionId(jakarta?.id || regions[0].id);
    }
  }, [regions, selectedRegionId, setSelectedRegionId]);

  return (
    <div className="ag-card-strong flex items-center justify-between px-4 py-3 text-sm">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-semibold"
          style={{ background: '#EAF3DE', color: 'var(--ag-primary)' }}
        >
          <Database size={18} strokeWidth={2} />
        </div>
        <div>
          <div className="font-semibold">Data Realtime</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Sumber data real-time PIHPS. (Integrasi cuaca BMKG dalam pengembangan)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CustomSelect
            value={selectedCommodityId}
            onChange={setSelectedCommodityId}
            options={(commodities || []).map((c: any) => ({ id: c.id, label: c.localName }))}
            className="min-w-[150px] shadow-sm"
          />
          <CustomSelect
            value={selectedRegionId}
            onChange={setSelectedRegionId}
            options={(regions || []).map((r: any) => ({ id: r.id, label: r.name }))}
            className="min-w-[150px] shadow-sm"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span>Confidence</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full" style={{ background: '#DCEBC9' }}>
            <div className="h-full rounded-full" style={{ width: '85%', background: 'var(--ag-primary)' }} />
          </div>
          <span className="font-semibold" style={{ color: 'var(--ag-primary)' }}>85%</span>
        </div>

        <span className="ag-chip px-3 py-1.5">Update 08.00 WIB</span>
      </div>
    </div>
  );
}

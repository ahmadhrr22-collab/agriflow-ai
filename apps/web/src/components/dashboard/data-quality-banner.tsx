'use client';

import { useEffect, useState, useRef } from 'react';
import { useCommodities } from '@/hooks/use-prices';
import { useDashboardStore } from '@/store/dashboard.store';
import { Database } from 'lucide-react';

type CommodityOption = {
  id: string;
  localName: string;
};

export function DataQualityBanner() {
  const { data: commodities } = useCommodities();
  const { selectedCommodityId, setSelectedCommodityId } = useDashboardStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Database size={18} strokeWidth={2} />
        </div>
        <div>
          <div className="font-semibold">Data Realtime</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Sumber data PIHPS Bank Indonesia dan BMKG
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="ag-button flex items-center justify-between gap-2 text-xs px-3 py-2 outline-none cursor-pointer min-w-[150px] bg-white border shadow-sm"
            style={{ fontWeight: 600, borderColor: 'var(--border)' }}
          >
            <span className="truncate">
              {commodities?.find((c: CommodityOption) => c.id === selectedCommodityId)?.localName || 'Pilih Komoditas'}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full rounded-lg border bg-white shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2" style={{ borderColor: 'var(--border)' }}>
              <div className="max-h-60 overflow-y-auto py-1">
                {commodities?.map((commodity: CommodityOption) => (
                  <button
                    key={commodity.id}
                    className="w-full text-left px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50"
                    style={{ 
                      color: selectedCommodityId === commodity.id ? 'var(--ag-primary)' : 'var(--foreground)',
                      background: selectedCommodityId === commodity.id ? 'var(--ag-soft)' : 'transparent'
                    }}
                    onClick={() => {
                      setSelectedCommodityId(commodity.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {commodity.localName}
                  </button>
                ))}
              </div>
            </div>
          )}
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

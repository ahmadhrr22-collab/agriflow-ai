'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/store/dashboard.store';
import aiApi from '@/lib/ai-api';
import { ArrowRight } from 'lucide-react';

type Recommendation = {
  origin_region_id: string;
  origin_name: string;
  dest_region_id: string;
  dest_name: string;
  score: number;
  reasons?: string[];
};

export function RecommendationPreview() {
  const { selectedCommodityId } = useDashboardStore();

  const { data, isLoading } = useQuery({
    queryKey: ['recommendations-preview', selectedCommodityId],
    queryFn: async () => {
      const res = await aiApi.get(
        `/recommendations/generate?commodity_id=${selectedCommodityId}&top_n=2`,
      );
      return res.data;
    },
    enabled: Boolean(selectedCommodityId),
    refetchInterval: 1000 * 60 * 10,
  });

  const recommendations = (data?.recommendations || []) as Recommendation[];

  return (
    <div className="ag-card-strong p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold">Rekomendasi</h3>
          <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Rute distribusi prioritas
          </p>
        </div>
        <Link href="/dashboard/recommendations" className="ag-button px-2.5 py-1.5 text-xs font-bold">
          Lihat semua
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((index) => (
            <div key={index} className="h-20 rounded-lg animate-pulse" style={{ background: 'var(--muted)' }} />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="ag-soft py-6 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Tidak ada rekomendasi saat ini
        </div>
      ) : (
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div key={`${rec.origin_region_id}-${rec.dest_region_id}`} className="ag-soft p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-1.5 text-xs font-bold truncate">
                  {rec.origin_name}
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" style={{ color: 'var(--ag-primary)' }} />
                  {rec.dest_name}
                </div>
                <span className="ag-chip px-2 py-0.5 shrink-0">
                  {(rec.score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="mt-2 text-xs line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                {rec.reasons?.[0] || 'Selisih harga antar wilayah'}
              </div>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#dfe8d2' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(100, rec.score * 100)}%`, background: 'var(--ag-primary)' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

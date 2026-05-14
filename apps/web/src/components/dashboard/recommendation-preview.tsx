'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDashboardStore } from '@/store/dashboard.store';

const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/api/v1',
});

export function RecommendationPreview() {
  const { selectedCommodityId } = useDashboardStore();

  const { data, isLoading } = useQuery({
    queryKey: ['recommendations-preview', selectedCommodityId],
    queryFn: async () => {
      const res = await aiApi.get(
        `/recommendations/generate?commodity_id=${selectedCommodityId}&top_n=2`
      );
      return res.data;
    },
    enabled: !!selectedCommodityId,
    refetchInterval: 1000 * 60 * 10,
  });

  const recommendations = data?.recommendations || [];

  return (
    <div className="rounded-xl p-4" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Rekomendasi</h3>
        <Link href="/dashboard/recommendations"
          className="text-xs font-medium"
          style={{color: '#166634'}}>
          Lihat semua →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg animate-pulse"
              style={{background: 'var(--muted)'}}></div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-xs text-center py-4"
          style={{color: 'var(--muted-foreground)'}}>
          Tidak ada rekomendasi saat ini
        </div>
      ) : (
        <div className="space-y-2">
          {recommendations.map((rec: any) => (
            <div key={`${rec.origin_region_id}-${rec.dest_region_id}`}
              className="p-3 rounded-lg" style={{
                background: 'var(--muted)',
                border: '0.5px solid var(--border)',
              }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-medium">
                  {rec.origin_name}
                  <span className="mx-1.5" style={{color: '#166534'}}>→</span>
                  {rec.dest_name}
                </div>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                  style={{background: '#EAF3DE', color: '#27500A'}}>
                  {(rec.score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
                {rec.reasons?.[0] || 'Selisih harga antar wilayah'}
              </div>
              <div className="mt-2 h-1 rounded-full overflow-hidden"
                style={{background: 'var(--border)'}}>
                <div className="h-full rounded-full"
                  style={{width: `${rec.score * 100}%`, background: '#639922'}}>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
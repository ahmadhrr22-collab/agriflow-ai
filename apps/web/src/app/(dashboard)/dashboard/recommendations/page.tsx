'use client';

import { useState }              from 'react';
import { useCommodities }        from '@/hooks/use-prices';
import { useRecommendations }    from '@/hooks/use-recommendations';

export default function RecommendationsPage() {
  const { data: commodities }          = useCommodities();
  const [commodityId, setCommodityId]  = useState('cmotsnfqt0000ix1oqixddl65');
  const [topN, setTopN]                = useState(5);

  const { data, isLoading } = useRecommendations(commodityId, topN);

  const recommendations = data?.recommendations || [];
  const selectedCommodity = commodities?.find((c: any) => c.id === commodityId);

  function getScoreColor(score: number) {
    if (score >= 0.7) return { bg: '#EAF3DE', color: '#27500A' };
    if (score >= 0.4) return { bg: '#FAEEDA', color: '#633806' };
    return { bg: '#F1EFE8', color: '#444441' };
  }

  function getScoreLabel(score: number) {
    if (score >= 0.7) return 'Sangat Disarankan';
    if (score >= 0.4) return 'Disarankan';
    return 'Pertimbangkan';
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Rekomendasi Distribusi</h2>
          <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
            Saran pengiriman berdasarkan gap harga antar wilayah
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={commodityId}
            onChange={(e) => setCommodityId(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{border: '0.5px solid var(--border)', background: 'var(--background)'}}
          >
            {commodities?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.localName}</option>
            ))}
          </select>
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{border: '0.5px solid var(--border)', background: 'var(--background)'}}
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Pasangan',
            value: data ? `${data.total_pairs}` : '-',
            sub:   'origin → destination',
          },
          {
            label: 'Region Dianalisis',
            value: data ? `${data.regions_analyzed}` : '-',
            sub:   'wilayah aktif',
          },
          {
            label: 'Rata-rata Nasional',
            value: data ? `Rp ${data.avg_price?.toLocaleString('id-ID')}` : '-',
            sub:   selectedCommodity?.localName || '-',
          },
          {
            label: 'Rekomendasi Aktif',
            value: `${recommendations.length}`,
            sub:   'saran distribusi',
            color: recommendations.length > 0 ? '#27500A' : 'var(--foreground)',
          },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{
            background: 'var(--background)',
            border: '0.5px solid var(--border)',
          }}>
            <div className="text-xs mb-2" style={{color: 'var(--muted-foreground)'}}>
              {m.label}
            </div>
            <div className="text-2xl font-medium mb-1"
              style={{color: m.color || 'var(--foreground)'}}>
              {m.value}
            </div>
            <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-xl text-xs" style={{
        background: '#E6F1FB',
        border: '0.5px solid #B5D4F4',
        color: '#0C447C',
      }}>
        <span className="font-medium">Catatan:</span> Rekomendasi ini bersifat informatif berdasarkan selisih harga antar wilayah.
        Keputusan distribusi tetap berada di tangan distributor dengan mempertimbangkan
        faktor logistik, relasi bisnis, dan kondisi lapangan.
      </div>

      {/* Recommendations list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="h-32 rounded-xl animate-pulse"
              style={{background: 'var(--muted)'}}></div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{
          background: 'var(--background)',
          border: '0.5px solid var(--border)',
        }}>
          <div className="text-2xl mb-3">◎</div>
          <div className="text-sm font-medium mb-1">Tidak ada rekomendasi saat ini</div>
          <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
            Selisih harga antar wilayah belum cukup signifikan untuk rekomendasi distribusi.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec: any, i: number) => {
            const scoreStyle = getScoreColor(rec.score);
            return (
              <div key={i} className="rounded-xl p-5" style={{
                background: 'var(--background)',
                border: '0.5px solid var(--border)',
              }}>
                <div className="flex items-start justify-between mb-4">
                  {/* Route */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{rec.origin_name}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full"
                        style={{background: '#EAF3DE', color: '#27500A'}}>
                        Rp {rec.origin_price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-lg" style={{color: '#166534'}}>
                      →
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{rec.dest_name}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full"
                        style={{background: '#FCEBEB', color: '#A32D2D'}}>
                        Rp {rec.dest_price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{background: scoreStyle.bg, color: scoreStyle.color}}>
                      {getScoreLabel(rec.score)}
                    </span>
                    <span className="text-lg font-medium"
                      style={{color: scoreStyle.color}}>
                      {(rec.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Surplus score',   value: (rec.surplus_score * 100).toFixed(0) + '%' },
                    { label: 'Defisit score',   value: (rec.deficit_score * 100).toFixed(0) + '%' },
                    { label: 'Selisih harga',   value: `Rp ${rec.price_differential.toLocaleString('id-ID')}` },
                    { label: 'Confidence',      value: (rec.confidence * 100).toFixed(0) + '%' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg p-2.5 text-center"
                      style={{background: 'var(--muted)'}}>
                      <div className="text-xs font-medium mb-0.5">{item.value}</div>
                      <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"
                    style={{color: 'var(--muted-foreground)'}}>
                    <span>Skor rekomendasi</span>
                    <span>{(rec.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden"
                    style={{background: 'var(--muted)'}}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${rec.score * 100}%`,
                        background: rec.score >= 0.7 ? '#166534'
                          : rec.score >= 0.4 ? '#EF9F27'
                          : '#888780',
                      }}></div>
                  </div>
                </div>

                {/* Reasons */}
                <div className="space-y-1.5">
                  {rec.reasons.map((reason: string, j: number) => (
                    <div key={j} className="flex items-start gap-2 text-xs"
                      style={{color: 'var(--muted-foreground)'}}>
                      <span style={{color: '#166534', flexShrink: 0}}>·</span>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
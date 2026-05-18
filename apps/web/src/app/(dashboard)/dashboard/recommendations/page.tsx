'use client';

import { useState, useEffect } from 'react';

import {
  useCommodities,
} from '@/hooks/use-prices';

import { useRecommendations } from '@/hooks/use-recommendations';
import { CustomSelect } from '@/components/ui/custom-select';
import { Map, MapPin, BadgeDollarSign, TrendingUp, Info, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RecommendationsPage() {
  const { data: commodities } = useCommodities();
  const [commodityId, setCommodityId] = useState('');

  // Initialize commodity from API
  useEffect(() => {
    if (commodities && commodities.length > 0 && !commodityId) {
      const cabaiMerah = commodities.find((c: any) => c.name === 'cabai-merah');
      setCommodityId(cabaiMerah?.id || commodities[0].id);
    }
  }, [commodities, commodityId]);

  const { data, isLoading } = useRecommendations(commodityId, 5);

  const recommendations = data?.recommendations || [];
  const hasAvgPrice = typeof data?.avg_price === 'number';
  const emptyMessage =
    data?.error ||
    'Selisih harga antar wilayah belum cukup signifikan untuk rekomendasi distribusi.';

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
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Saran pengiriman berdasarkan gap harga antar wilayah
          </p>
        </div>

        <CustomSelect
          value={commodityId}
          onChange={setCommodityId}
          options={(commodities || []).map((c: any) => ({ id: c.id, label: c.localName }))}
          className="min-w-[150px]"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Rute Distribusi Potensial',
            value: `${data?.total_pairs ?? 0}`,
            sub: 'Analisis dari origin ke destinasi',
            icon: MapPin,
          },
          {
            label: 'Wilayah Terjangkau',
            value: `${data?.regions_analyzed ?? 0}`,
            sub: 'Region aktif terpantau',
            icon: Map,
          },
          {
            label: 'Harga Rata-rata Nasional',
            value: hasAvgPrice
              ? `Rp ${data.avg_price.toLocaleString('id-ID')}`
              : '-',
            sub: selectedCommodity?.localName || '-',
            icon: BadgeDollarSign,
          },
          {
            label: 'Peluang Distribusi',
            value: `${recommendations.length}`,
            sub: 'Saran tindakan saat ini',
            color: recommendations.length > 0 ? '#27500A' : 'var(--foreground)',
            icon: TrendingUp,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: 'var(--background)', border: '0.5px solid var(--border)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#F1EFE8', color: '#444441' }}>
              <m.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {m.label}
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: m.color || 'var(--foreground)' }}>
                {m.value}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                {m.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        className="px-4 py-3.5 rounded-xl text-xs flex items-start gap-2.5"
        style={{ background: '#F4F9FD', border: '0.5px solid #B5D4F4', color: '#0C447C' }}
      >
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Penting:</span> Rekomendasi ini bersifat informatif berdasarkan analisis selisih harga dan pasokan antar wilayah. 
          Keputusan eksekusi distribusi tetap berada di tangan Anda dengan mempertimbangkan faktor logistik riil, relasi bisnis, dan kondisi lapangan.
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl animate-pulse"
              style={{ background: 'var(--muted)' }}
            />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        /* Empty state */
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'var(--background)', border: '0.5px solid var(--border)' }}
        >
          <div className="text-2xl mb-3">◎</div>
          <div className="text-sm font-medium mb-1">Tidak ada rekomendasi saat ini</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {emptyMessage}
          </div>
        </div>
      ) : (
        /* Recommendations */
        <div className="space-y-3">
          {recommendations.map((rec: any, i: number) => {
            const scoreStyle = getScoreColor(rec.score);
            return (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ background: 'var(--background)', border: '0.5px solid var(--border)' }}
              >
                <div className="flex items-start justify-between mb-5">
                  {/* Route */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Wilayah Surplus (Asal)</div>
                      <div className="flex items-center gap-2">
                        <div className="text-base font-bold">{rec.origin_name}</div>
                        <div
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: '#EAF3DE', color: '#27500A' }}
                        >
                          Rp {rec.origin_price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center px-2" style={{ color: '#166534' }}>
                      <ArrowRight className="w-5 h-5 opacity-40" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Wilayah Defisit (Tujuan)</div>
                      <div className="flex items-center gap-2">
                        <div className="text-base font-bold">{rec.dest_name}</div>
                        <div
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: '#FCEBEB', color: '#A32D2D' }}
                        >
                          Rp {rec.dest_price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide"
                      style={{ background: scoreStyle.bg, color: scoreStyle.color, fontSize: '10px' }}
                    >
                      {getScoreLabel(rec.score)}
                    </span>
                    <span className="text-xl font-bold" style={{ color: scoreStyle.color }}>
                      {(rec.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Indikator Surplus', value: (rec.surplus_score * 100).toFixed(0) + '%' },
                    { label: 'Indikator Defisit', value: (rec.deficit_score * 100).toFixed(0) + '%' },
                    { label: 'Potensi Margin', value: `Rp ${rec.price_differential.toLocaleString('id-ID')}` },
                    { label: 'Tingkat Keyakinan', value: (rec.confidence * 100).toFixed(0) + '%' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg p-3 text-center border"
                      style={{ background: '#FAFAFA', borderColor: 'var(--border)' }}
                    >
                      <div className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>{item.value}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score bar */}
                <div className="mb-4">
                  <div
                    className="flex justify-between text-xs mb-2 font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span>Skor Kelayakan Distribusi</span>
                    <span style={{ color: 'var(--foreground)' }}>{(rec.score * 100).toFixed(1)}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--muted)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${rec.score * 100}%`,
                        background:
                          rec.score >= 0.7 ? '#166534' : rec.score >= 0.4 ? '#EF9F27' : '#888780',
                      }}
                    />
                  </div>
                </div>

                {/* Reasons */}
                <div className="space-y-2 mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>Faktor Pendukung:</div>
                  {rec.reasons.map((reason: string, j: number) => (
                    <div
                      key={j}
                      className="flex items-start gap-2.5 text-sm leading-relaxed"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#639922' }} />
                      <span className="font-medium">{reason}</span>
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

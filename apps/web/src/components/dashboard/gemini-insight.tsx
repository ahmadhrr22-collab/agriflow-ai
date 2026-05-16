'use client';

import { useEffect }         from 'react';
import { useMarketInsight }  from '@/hooks/use-insights';
import { useDashboardStore } from '@/store/dashboard.store';
import { useCommodities }    from '@/hooks/use-prices';
import { Sparkles, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

const sentimentConfig = {
  bullish: { label: 'Bullish',  bg: '#EAF3DE', color: '#27500A', dot: '#166534' },
  bearish: { label: 'Bearish',  bg: '#FCEBEB', color: '#A32D2D', dot: '#E24B4A' },
  neutral: { label: 'Netral',   bg: '#F1EFE8', color: '#444441', dot: '#888780' },
};

function SkeletonInsight() {
  return (
    <div className="rounded-xl p-5 animate-pulse" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded" style={{background: 'var(--muted)'}}></div>
        <div className="h-4 w-32 rounded" style={{background: 'var(--muted)'}}></div>
        <div className="ml-auto h-5 w-16 rounded-full" style={{background: 'var(--muted)'}}></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded" style={{background: 'var(--muted)'}}></div>
        <div className="h-3 w-4/5 rounded" style={{background: 'var(--muted)'}}></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg" style={{background: 'var(--muted)'}}></div>
        <div className="h-16 rounded-lg" style={{background: 'var(--muted)'}}></div>
      </div>
    </div>
  );
}

export function GeminiInsight() {
  const { selectedCommodityId }        = useDashboardStore();
  const { data: commodities }          = useCommodities();
  const { mutate, data, isPending, isIdle } = useMarketInsight();

  const selectedCommodity = commodities?.find((c: any) => c.id === selectedCommodityId);

  useEffect(() => {
    if (selectedCommodityId && selectedCommodity) {
      mutate({
        commodity_id:   selectedCommodityId,
        commodity_name: selectedCommodity.localName,
      });
    }
  }, [selectedCommodityId, selectedCommodity]);

  if (isPending || isIdle) return <SkeletonInsight />;

  const insight   = data?.insight;
  const sentiment = sentimentConfig[insight?.sentiment as keyof typeof sentimentConfig]
    || sentimentConfig.neutral;

  return (
    <div className="rounded-xl p-5" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{background: '#EAF3DE'}}>
          <Sparkles className="w-3.5 h-3.5" style={{color: '#27500A'}} />
        </div>
        <span className="text-sm font-medium">AI Market Insight</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full"
            style={{background: sentiment.dot}}></div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{background: sentiment.bg, color: sentiment.color}}>
            {sentiment.label}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed mb-4" style={{color: 'var(--foreground)'}}>
        {insight?.summary}
      </p>

      {/* Risk & Recommendation */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg" style={{
          background: '#FAEEDA',
          border: '0.5px solid #FAC775',
        }}>
          <div className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{color: '#633806'}}>
            <AlertTriangle className="w-3.5 h-3.5" /> Risiko
          </div>
          <div className="text-xs leading-relaxed" style={{color: '#854F0B'}}>
            {insight?.risk}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{
          background: '#EAF3DE',
          border: '0.5px solid #C0DD97',
        }}>
          <div className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{color: '#27500A'}}>
            <TrendingUp className="w-3.5 h-3.5" /> Rekomendasi
          </div>
          <div className="text-xs leading-relaxed" style={{color: '#3B6D11'}}>
            {insight?.recommendation}
          </div>
        </div>
      </div>

      {/* Market data pills */}
      <div className="flex flex-wrap gap-2 pt-3"
        style={{borderTop: '0.5px solid var(--border)'}}>
        {[
          { label: 'Rata-rata', value: `Rp ${data?.market_data?.avg_price?.toLocaleString('id-ID')}` },
          { label: 'Spread',    value: `Rp ${data?.market_data?.spread?.toLocaleString('id-ID')}` },
          { label: 'Tren 7h',   value: data?.market_data?.trend_7d },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{background: 'var(--muted)', color: 'var(--muted-foreground)'}}>
            <span style={{color: 'var(--foreground)', fontWeight: 500}}>{item.label}:</span>
            {item.value}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>
          Dianalisis oleh Gemini AI · {data?.commodity}
        </span>
        <button
          onClick={() => selectedCommodity && mutate({
            commodity_id:   selectedCommodityId,
            commodity_name: selectedCommodity.localName,
          })}
          className="text-xs font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{color: '#166534', cursor: 'pointer'}}
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>
    </div>
  );
}
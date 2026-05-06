'use client';

import { usePriceHistory }   from '@/hooks/use-prices';
import { useDashboardStore } from '@/store/dashboard.store';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-sm" style={{
        background: 'var(--background)',
        border: '0.5px solid var(--border)',
      }}>
        <div className="font-medium mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{background: p.color}}></div>
            <span style={{color: 'var(--muted-foreground)'}}>Harga:</span>
            <span className="font-medium">
              Rp {p.value?.toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function SkeletonChart() {
  return (
    <div className="rounded-xl p-5 animate-pulse" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="h-4 w-48 rounded mb-2" style={{background: 'var(--muted)'}}></div>
      <div className="h-3 w-32 rounded mb-6" style={{background: 'var(--muted)'}}></div>
      <div className="h-60 rounded" style={{background: 'var(--muted)'}}></div>
    </div>
  );
}

export function PriceChart() {
  const { selectedCommodityId, selectedRegionId } = useDashboardStore();
  const { data, isLoading } = usePriceHistory(selectedCommodityId, selectedRegionId, 14);

  if (isLoading) return <SkeletonChart />;

  const chartData = (data || []).map((record: any) => ({
    date:  new Date(record.recordedAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short'
    }),
    price: record.price,
  }));

  return (
    <div className="rounded-xl p-5" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium">Tren Harga Cabai Merah</h3>
          <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
            Jakarta Pusat · 14 hari historis
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{color: 'var(--muted-foreground)'}}>
          <div className="w-3 h-0.5" style={{background: '#166534'}}></div>
          Aktual
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-sm"
          style={{color: 'var(--muted-foreground)'}}>
          Belum ada data historis untuk region ini.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{top: 5, right: 5, left: 0, bottom: 5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{fontSize: 11, fill: 'var(--muted-foreground)'}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{fontSize: 11, fill: 'var(--muted-foreground)'}}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#166534"
              strokeWidth={2}
              dot={{r: 3, fill: '#166534'}}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 text-xs"
        style={{borderTop: '0.5px solid var(--border)', color: 'var(--muted-foreground)'}}>
        <span>Confidence score:</span>
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{background: 'var(--muted)'}}>
          <div className="h-full rounded-full" style={{width: '85%', background: '#639922'}}></div>
        </div>
        <span className="font-medium" style={{color: 'var(--foreground)'}}>85%</span>
        <span style={{marginLeft: 'auto'}}>Sumber: Panel Harga Kementan</span>
      </div>
    </div>
  );
}
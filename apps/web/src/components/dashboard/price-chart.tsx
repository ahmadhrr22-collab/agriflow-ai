'use client';

import dynamic from 'next/dynamic';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const data = [
  { date: '22 Apr', price: 28500, forecast: null },
  { date: '24 Apr', price: 29200, forecast: null },
  { date: '26 Apr', price: 30100, forecast: null },
  { date: '28 Apr', price: 31500, forecast: null },
  { date: '30 Apr', price: 33200, forecast: null },
  { date: '2 Mei',  price: 34800, forecast: null },
  { date: '4 Mei',  price: 36200, forecast: null },
  { date: '5 Mei',  price: 38500, forecast: null },
  { date: '6 Mei',  price: null,  forecast: 39200 },
  { date: '7 Mei',  price: null,  forecast: 40100 },
  { date: '8 Mei',  price: null,  forecast: 41500 },
  { date: '9 Mei',  price: null,  forecast: 42200 },
  { date: '10 Mei', price: null,  forecast: 43800 },
  { date: '11 Mei', price: null,  forecast: 44200 },
  { date: '12 Mei', price: null,  forecast: 45000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-sm shadow-sm" style={{
        background: 'var(--background)',
        border: '0.5px solid var(--border)',
      }}>
        <div className="font-medium mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{background: p.color}}></div>
            <span style={{color: 'var(--muted-foreground)'}}>
              {p.name === 'price' ? 'Aktual' : 'Prediksi'}:
            </span>
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

export function PriceChart() {
  return (
    <div className="rounded-xl p-5" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium">Tren Harga Cabai Merah</h3>
          <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
            Jakarta · 14 hari historis + 7 hari forecast
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{color: 'var(--muted-foreground)'}}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5" style={{background: '#166534'}}></div>
            Aktual
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t-2 border-dashed" style={{borderColor: '#639922'}}></div>
            Prediksi
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{top: 5, right: 5, left: 0, bottom: 5}}>
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
          <ReferenceLine x="5 Mei" stroke="#E24B4A" strokeDasharray="3 3"
            label={{value: 'Hari ini', fill: '#A32D2D', fontSize: 10}} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#166534"
            strokeWidth={2}
            dot={{r: 3, fill: '#166534'}}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#639922"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{r: 3, fill: '#639922'}}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Confidence indicator */}
      <div className="flex items-center gap-2 mt-3 pt-3 text-xs"
        style={{borderTop: '0.5px solid var(--border)', color: 'var(--muted-foreground)'}}>
        <span>Kepercayaan prediksi:</span>
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{background: 'var(--muted)'}}>
          <div className="h-full rounded-full" style={{width: '83%', background: '#639922'}}></div>
        </div>
        <span className="font-medium" style={{color: 'var(--foreground)'}}>83%</span>
        <span style={{marginLeft: 'auto'}}>
          Model: XGBoost v1 · Diupdate tadi malam 02.00 WIB
        </span>
      </div>
    </div>
  );
}
'use client';

import { useState }       from 'react';
import { useCommodities } from '@/hooks/use-prices';
import { useAnomalies }   from '@/hooks/use-anomalies';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';


const REGIONS = [
  { id: 'cmotsnfsj0003ix1o3g2vp8h2', name: 'Jakarta Pusat'   },
  { id: 'cmotsnft30004ix1or61zz8ey',  name: 'Jakarta Timur'   },
  { id: 'cmotsnftb0005ix1o753b0twr',  name: 'Jakarta Barat'   },
  { id: 'cmotsnftl0006ix1ong9qd4o7',  name: 'Jakarta Selatan' },
  { id: 'cmotsnftu0007ix1omf5rtn2b',  name: 'Bandung'         },
  { id: 'cmotsnfu20008ix1oumv4kziy',  name: 'Garut'           },
  { id: 'cmotsnfuc0009ix1o6iagi0bk',  name: 'Majalengka'      },
  { id: 'cmotsnfuk000aix1ou83mc9he',  name: 'Brebes'          },
  { id: 'cmotsnfut000bix1o7kdg92q5',  name: 'Bogor'           },
  { id: 'cmotsnfv1000cix1owoz720o0',  name: 'Bekasi'          },
];

function usePriceHistory(commodityId: string, regionId: string) {
  return useQuery({
    queryKey: ['price-history-anomaly', commodityId, regionId],
    queryFn: async () => {
      const res = await api.get(
        `/prices/history?commodityId=${commodityId}&regionId=${regionId}&days=30`
      );
      return res.data;
    },
    enabled: !!commodityId && !!regionId,
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-sm" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="font-medium mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{background: '#166534'}}></div>
        <span style={{color: 'var(--muted-foreground)'}}>Harga:</span>
        <span className="font-medium">
          Rp {Number(payload[0]?.value).toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
};

export default function AnomaliesPage() {
  const { data: commodities }  = useCommodities();
  const [commodityId, setCommodityId] = useState('cmotsnfqt0000ix1oqixddl65');
  const [regionId, setRegionId]       = useState('cmotsnfsj0003ix1o3g2vp8h2');

  const { data: anomalyData, isLoading } = useAnomalies(commodityId, regionId);
  const { data: historyData }            = usePriceHistory(commodityId, regionId);

  const anomalies       = anomalyData?.anomalies || [];
  const selectedRegion  = REGIONS.find((r) => r.id === regionId);
  const selectedCommodity = commodities?.find((c: any) => c.id === commodityId);

  // Format chart data dengan anomaly markers
  const chartData = (historyData || []).map((r: any) => {
    const date     = new Date(r.recordedAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short',
    });
    const isAnomaly = anomalies.some((a: any) => {
      const aDate = new Date(a.date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short',
      });
      return aDate === date;
    });
    return { date, price: r.price, isAnomaly };
  });

  const anomalyDates = new Set(
    anomalies.map((a: any) =>
      new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    )
  );

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Deteksi Anomali</h2>
          <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
            Lonjakan harga tidak wajar · Statistical + Isolation Forest
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
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{border: '0.5px solid var(--border)', background: 'var(--background)'}}
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Anomali',
            value: isLoading ? '-' : `${anomalyData?.total_anomalies || 0}`,
            sub:   '30 hari terakhir',
            color: (anomalyData?.total_anomalies || 0) > 3 ? '#A32D2D'
              : (anomalyData?.total_anomalies || 0) > 0 ? '#633806'
              : '#27500A',
          },
          {
            label: 'Kritis',
            value: isLoading ? '-' : `${anomalies.filter((a: any) => a.severity === 'critical').length}`,
            sub:   'z-score > 3 atau pct > 20%',
            color: '#A32D2D',
          },
          {
            label: 'Waspada',
            value: isLoading ? '-' : `${anomalies.filter((a: any) => a.severity === 'warning').length}`,
            sub:   'z-score > 2 atau pct > 10%',
            color: '#633806',
          },
          {
            label: 'Data Dianalisis',
            value: isLoading ? '-' : `${anomalyData?.data_points || 0}`,
            sub:   'hari historis',
            color: 'var(--foreground)',
          },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{
            background: 'var(--background)',
            border: '0.5px solid var(--border)',
          }}>
            <div className="text-xs mb-2" style={{color: 'var(--muted-foreground)'}}>
              {m.label}
            </div>
            <div className="text-2xl font-medium mb-1" style={{color: m.color}}>
              {m.value}
            </div>
            <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Price chart with anomaly markers */}
        <div className="col-span-2 rounded-xl p-5" style={{
          background: 'var(--background)',
          border: '0.5px solid var(--border)',
        }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-medium">
                {selectedCommodity?.localName} · {selectedRegion?.name}
              </h3>
              <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
                Titik merah = anomali terdeteksi · 30 hari terakhir
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs"
              style={{color: 'var(--muted-foreground)'}}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{background: '#166534'}}></div>
                Normal
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{background: '#E24B4A'}}></div>
                Anomali
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{top: 10, right: 10, left: 0, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{fontSize: 11, fill: 'var(--muted-foreground)'}}
                axisLine={false}
                tickLine={false}
                interval={4}
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
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isAnom = anomalyDates.has(payload.date);
                  return (
                    <circle
                      key={payload.date}
                      cx={cx}
                      cy={cy}
                      r={isAnom ? 6 : 3}
                      fill={isAnom ? '#E24B4A' : '#166534'}
                      stroke={isAnom ? 'white' : 'none'}
                      strokeWidth={isAnom ? 2 : 0}
                    />
                  );
                }}
              />
              {anomalies.map((a: any) => {
                const date = new Date(a.date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short',
                });
                return (
                  <ReferenceDot
                    key={a.date}
                    x={date}
                    y={a.price}
                    r={0}
                    label={{
                      value: a.severity === 'critical' ? '⚠' : '!',
                      fontSize: 12,
                      fill: '#E24B4A',
                      position: 'top',
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-3 pt-3 text-xs" style={{
            borderTop: '0.5px solid var(--border)',
            color: 'var(--muted-foreground)',
          }}>
            Metode: Z-score (threshold: 2.0) + Perubahan 7 hari (threshold: 10%) + Isolation Forest
          </div>
        </div>

        {/* Anomaly list */}
        <div className="rounded-xl overflow-hidden" style={{
          background: 'var(--background)',
          border: '0.5px solid var(--border)',
          height: 'fit-content',
        }}>
          <div className="px-4 py-3 text-xs font-medium flex items-center gap-2"
            style={{borderBottom: '0.5px solid var(--border)'}}>
            Detail Anomali
            {anomalies.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full"
                style={{background: '#FCEBEB', color: '#A32D2D'}}>
                {anomalies.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="h-16 rounded-lg animate-pulse"
                  style={{background: 'var(--muted)'}}></div>
              ))}
            </div>
          ) : anomalies.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-2xl mb-2">✓</div>
              <div className="text-sm font-medium" style={{color: '#27500A'}}>
                Tidak ada anomali
              </div>
              <div className="text-xs mt-1" style={{color: 'var(--muted-foreground)'}}>
                Harga bergerak normal dalam 30 hari terakhir
              </div>
            </div>
          ) : (
            <div className="divide-y" style={{borderColor: 'var(--border)'}}>
              {anomalies.map((a: any, i: number) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">{a.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                      background: a.severity === 'critical' ? '#FCEBEB' : '#FAEEDA',
                      color:      a.severity === 'critical' ? '#A32D2D' : '#633806',
                    }}>
                      {a.severity === 'critical' ? 'Kritis' : 'Waspada'}
                    </span>
                  </div>
                  <div className="text-xs mb-2" style={{color: 'var(--foreground)'}}>
                    Rp {a.price.toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs mb-2" style={{color: 'var(--muted-foreground)'}}>
                    {a.explanation}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{background: 'var(--muted)', color: 'var(--muted-foreground)'}}>
                      z: {a.z_score}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{background: 'var(--muted)', color: 'var(--muted-foreground)'}}>
                      Δ7d: {a.pct_change}%
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{background: 'var(--muted)', color: 'var(--muted-foreground)'}}>
                      signals: {a.signals}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
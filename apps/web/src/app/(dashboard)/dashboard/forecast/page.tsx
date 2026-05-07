'use client';

import { useState, useEffect }  from 'react';
import { useCommodities }       from '@/hooks/use-prices';
import { useForecast }          from '@/hooks/use-forecasts';
import { useAnomalies }         from '@/hooks/use-anomalies';
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const REGIONS = [
  { id: 'cmotsnfsj0003ix1o3g2vp8h2', name: 'Jakarta Pusat'  },
  { id: 'cmotsnft30004ix1or61zz8ey',  name: 'Jakarta Timur'  },
  { id: 'cmotsnftb0005ix1o753b0twr',  name: 'Jakarta Barat'  },
  { id: 'cmotsnftl0006ix1ong9qd4o7',  name: 'Jakarta Selatan'},
  { id: 'cmotsnftu0007ix1omf5rtn2b',  name: 'Bandung'        },
  { id: 'cmotsnfu20008ix1oumv4kziy',  name: 'Garut'          },
  { id: 'cmotsnfuc0009ix1o6iagi0bk',  name: 'Majalengka'     },
  { id: 'cmotsnfuk000aix1ou83mc9he',  name: 'Brebes'         },
  { id: 'cmotsnfut000bix1o7kdg92q5',  name: 'Bogor'          },
  { id: 'cmotsnfv1000cix1owoz720o0',  name: 'Bekasi'         },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-sm" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="font-medium mb-2">{label}</div>
      {payload.map((p: any) => {
        if (!p.value || p.name === 'ci_range') return null;
        return (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{background: p.color}}></div>
            <span style={{color: 'var(--muted-foreground)'}}>
              {p.name === 'predicted' ? 'Prediksi' : 'CI Range'}:
            </span>
            <span className="font-medium">
              Rp {Number(p.value).toLocaleString('id-ID')}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function ForecastPage() {
  const { data: commodities }  = useCommodities();
  const [commodityId, setCommodityId] = useState('cmotsnfqt0000ix1oqixddl65');
  const [regionId, setRegionId]       = useState('cmotsnfsj0003ix1o3g2vp8h2');

  const { mutate, data: forecastData, isPending } = useForecast();
  const { data: anomalyData } = useAnomalies(commodityId, regionId);

  useEffect(() => {
    mutate({ commodity_id: commodityId, region_id: regionId });
  }, [commodityId, regionId]);

  const chartData = (forecastData?.forecasts || []).map((f: any) => ({
    date:      new Date(f.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    predicted: f.predicted,
    ci_low:    f.lower_bound,
    ci_high:   f.upper_bound,
  }));

  const selectedRegion     = REGIONS.find((r) => r.id === regionId);
  const selectedCommodity  = commodities?.find((c: any) => c.id === commodityId);
  const anomalies          = anomalyData?.anomalies || [];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Demand Forecast</h2>
          <p className="text-xs mt-0.5" style={{color: 'var(--muted-foreground)'}}>
            Prediksi harga 7 hari ke depan · Prophet + XGBoost Ensemble
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

      {/* Model metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Model',
            value: 'Ensemble',
            sub:   'Prophet + XGBoost',
          },
          {
            label: 'MAPE',
            value: forecastData ? `${forecastData.mape}%` : '-',
            sub:   forecastData?.mape < 10 ? '✓ Akurasi tinggi' : 'Akurasi sedang',
            color: forecastData?.mape < 10 ? '#27500A' : '#633806',
          },
          {
            label: 'Data Points',
            value: forecastData ? `${forecastData.data_points}` : '-',
            sub:   'Hari historis dipakai',
          },
          {
            label: 'Anomali Terdeteksi',
            value: `${anomalyData?.total_anomalies || 0}`,
            sub:   '30 hari terakhir',
            color: (anomalyData?.total_anomalies || 0) > 0 ? '#A32D2D' : '#27500A',
          },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{
            background: 'var(--background)',
            border: '0.5px solid var(--border)',
          }}>
            <div className="text-xs mb-2" style={{color: 'var(--muted-foreground)'}}>
              {m.label}
            </div>
            <div className="text-xl font-medium mb-1"
              style={{color: m.color || 'var(--foreground)'}}>
              {m.value}
            </div>
            <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Forecast chart */}
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
                Prediksi 7 hari ke depan dengan confidence interval 80%
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs"
              style={{color: 'var(--muted-foreground)'}}>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-dashed border-t-2"
                  style={{borderColor: '#639922'}}></div>
                Prediksi
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm opacity-40"
                  style={{background: '#639922'}}></div>
                CI 80%
              </div>
            </div>
          </div>

          {isPending ? (
            <div className="h-64 flex items-center justify-center animate-pulse rounded-lg"
              style={{background: 'var(--muted)'}}>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData} margin={{top: 5, right: 5, left: 0, bottom: 5}}>
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
                <Area
                  type="monotone"
                  dataKey="ci_high"
                  fill="#639922"
                  stroke="none"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="ci_low"
                  fill="var(--background)"
                  stroke="none"
                  fillOpacity={1}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#639922"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{r: 4, fill: '#639922'}}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 text-xs"
            style={{borderTop: '0.5px solid var(--border)', color: 'var(--muted-foreground)'}}>
            <span>Model: Prophet + XGBoost Ensemble</span>
            {forecastData?.mape && (
              <span>MAPE:
                <span className="font-medium ml-1" style={{
                  color: forecastData.mape < 10 ? '#27500A' : '#633806'
                }}>
                  {forecastData.mape}%
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Forecast table + anomalies */}
        <div className="space-y-4">
          {/* 7-day table */}
          <div className="rounded-xl overflow-hidden" style={{
            background: 'var(--background)',
            border: '0.5px solid var(--border)',
          }}>
            <div className="px-4 py-3 text-xs font-medium"
              style={{borderBottom: '0.5px solid var(--border)'}}>
              Prediksi 7 Hari
            </div>
            <div className="divide-y" style={{borderColor: 'var(--border)'}}>
              {(forecastData?.forecasts || []).map((f: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5">
                  <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
                    {new Date(f.date).toLocaleDateString('id-ID', {
                      weekday: 'short', day: 'numeric', month: 'short'
                    })}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium">
                      Rp {f.predicted.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
                      ±{Math.round((f.upper_bound - f.lower_bound) / 2).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly list */}
          {anomalies.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{
              background: 'var(--background)',
              border: '0.5px solid var(--border)',
            }}>
              <div className="px-4 py-3 text-xs font-medium flex items-center gap-2"
                style={{borderBottom: '0.5px solid var(--border)'}}>
                Anomali Terdeteksi
                <span className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{background: '#FCEBEB', color: '#A32D2D'}}>
                  {anomalies.length}
                </span>
              </div>
              <div className="divide-y" style={{borderColor: 'var(--border)'}}>
                {anomalies.slice(0, 3).map((a: any, i: number) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{a.date}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                        background: a.severity === 'critical' ? '#FCEBEB' : '#FAEEDA',
                        color:      a.severity === 'critical' ? '#A32D2D' : '#633806',
                      }}>
                        {a.severity === 'critical' ? 'Kritis' : 'Waspada'}
                      </span>
                    </div>
                    <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
                      {a.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
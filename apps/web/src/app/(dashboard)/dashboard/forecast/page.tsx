'use client';

import { useState, useEffect } from 'react';

import {
  useCommodities,
  useRegions,
} from '@/hooks/use-prices';

import { useForecast } from '@/hooks/use-forecasts';
import { useAnomalies } from '@/hooks/use-anomalies';
import { CustomSelect } from '@/components/ui/custom-select';
import { BrainCircuit, Target, Database, AlertTriangle } from 'lucide-react';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{
        background: 'var(--background)',
        border: '0.5px solid var(--border)',
      }}
    >
      <div className="font-medium mb-2">
        {label}
      </div>

      {payload.map((p: any) => {
        if (!p.value || p.name === 'ci_range') {
          return null;
        }

        return (
          <div
            key={p.name}
            className="flex items-center gap-2 mb-1"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />

            <span
              style={{
                color:
                  'var(--muted-foreground)',
              }}
            >
              {p.name === 'predicted'
                ? 'Prediksi'
                : 'Estimasi Rentang'}
              :
            </span>

            <span className="font-medium">
              Rp{' '}
              {Number(
                p.value,
              ).toLocaleString('id-ID')}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function ForecastPage() {
  const { data: commodities } =
    useCommodities();

  const { data: regions } =
    useRegions();

  const [commodityId, setCommodityId] =
    useState('');

  const [regionId, setRegionId] =
    useState('');

  const {
    mutate,
    data: forecastData,
    isPending,
  } = useForecast();

  const { data: anomalyData } =
    useAnomalies(
      commodityId,
      regionId,
    );

  // Initialize default values from API
  useEffect(() => {
    if (
      commodities &&
      commodities.length > 0 &&
      !commodityId
    ) {
      const cabaiMerah =
        commodities.find(
          (c: any) =>
            c.name === 'cabai-merah',
        );

      setCommodityId(
        cabaiMerah?.id ||
          commodities[0].id,
      );
    }
  }, [commodities, commodityId]);

  useEffect(() => {
    if (
      regions &&
      regions.length > 0 &&
      !regionId
    ) {
      const jakartaPusat =
        regions.find(
          (r: any) =>
            r.name ===
            'Jakarta Pusat',
        );

      setRegionId(
        jakartaPusat?.id ||
          regions[0].id,
      );
    }
  }, [regions, regionId]);

  // Forecast request
  useEffect(() => {
    if (!commodityId || !regionId) {
      return;
    }

    mutate({
      commodity_id: commodityId,
      region_id: regionId,
    });
  }, [
    commodityId,
    regionId,
    mutate,
  ]);

  const chartData = (
    forecastData?.forecasts || []
  ).map((f: any) => ({
    date: new Date(
      f.date,
    ).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short',
      },
    ),

    predicted: f.predicted,
    ci_low: f.lower_bound,
    ci_high: f.upper_bound,
  }));

  const selectedRegion =
    regions?.find(
      (r: any) => r.id === regionId,
    );

  const selectedCommodity =
    commodities?.find(
      (c: any) =>
        c.id === commodityId,
    );

  const anomalies =
    anomalyData?.anomalies || [];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">
            Prakiraan Harga & Pasokan
          </h2>

          <p
            className="text-xs mt-0.5"
            style={{
              color:
                'var(--muted-foreground)',
            }}
          >
            Prediksi harga 7 hari ke depan ·
            Didukung oleh AI Prediktif Agriflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CustomSelect
            value={commodityId}
            onChange={setCommodityId}
            options={(commodities || []).map((c: any) => ({ id: c.id, label: c.localName }))}
            className="min-w-[150px]"
          />

          <CustomSelect
            value={regionId}
            onChange={setRegionId}
            options={(regions || []).map((r: any) => ({ id: r.id, label: r.name }))}
            className="min-w-[150px]"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Status AI Prediktif',
            value: 'Aktif',
            sub: 'Memantau harga pasar',
            icon: BrainCircuit,
          },
          {
            label: 'Tingkat Akurasi Prediksi',
            value: forecastData
              ? `${(100 - forecastData.mape).toFixed(1)}%`
              : '-',
            sub:
              forecastData?.mape < 10
                ? 'Akurasi tinggi'
                : 'Akurasi sedang',
            color:
              forecastData?.mape < 10
                ? '#27500A'
                : '#633806',
            icon: Target,
          },
          {
            label: 'Volume Data Pelatihan',
            value: forecastData
              ? `${forecastData.data_points}`
              : '-',
            sub:
              'Riwayat data harian',
            icon: Database,
          },
          {
            label:
              'Deteksi Anomali',
            value: `${
              anomalyData?.total_anomalies ||
              0
            }`,
            sub:
              '30 hari terakhir',
            color:
              (
                anomalyData?.total_anomalies ||
                0
              ) > 0
                ? '#A32D2D'
                : '#27500A',
            icon: AlertTriangle,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: 'var(--background)',
              border: '0.5px solid var(--border)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#F1EFE8', color: '#444441' }}>
              <m.icon className="w-4 h-4" />
            </div>
            <div>
              <div
                className="text-xs mb-1 font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {m.label}
              </div>
              <div
                className="text-2xl font-bold mb-0.5"
                style={{ color: m.color || 'var(--foreground)' }}
              >
                {m.value}
              </div>
              <div
                className="text-[11px]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {m.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Chart */}
      <div
        className="rounded-xl p-5"
        style={{
          background:
            'var(--background)',

          border:
            '0.5px solid var(--border)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-medium">
              {
                selectedCommodity?.localName
              }{' '}
              ·{' '}
              {selectedRegion?.name}
            </h3>

            <p
              className="text-xs mt-0.5"
              style={{
                color:
                  'var(--muted-foreground)',
              }}
            >
              Estimasi rentang harga 7 hari ke depan (akurasi 80%)
            </p>
          </div>

          <div
            className="flex items-center gap-3 text-xs"
            style={{
              color:
                'var(--muted-foreground)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-0.5 border-dashed border-t-2"
                style={{
                  borderColor:
                    '#639922',
                }}
              />

              Prediksi
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-2 rounded-sm opacity-40"
                style={{
                  background:
                    '#639922',
                }}
              />

              Rentang Prediksi
            </div>
          </div>
        </div>

        {isPending ? (
          <div
            className="h-64 flex items-center justify-center animate-pulse rounded-lg"
            style={{
              background:
                'var(--muted)',
            }}
          />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <ComposedChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: 'var(--muted-foreground)',
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: 'var(--muted-foreground)',
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `${(
                    v / 1000
                  ).toFixed(0)}k`
                }
              />

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />

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
                dot={{
                  r: 4,
                  fill: '#639922',
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-3 pt-3 text-xs"
          style={{
            borderTop:
              '0.5px solid var(--border)',

            color:
              'var(--muted-foreground)',
          }}
        >
          <span>
            AI Engine: Agriflow Predictive System
          </span>

          {forecastData?.mape && (
            <span>
              Akurasi:

              <span
                className="font-medium ml-1"
                style={{
                  color:
                    forecastData.mape <
                    10
                      ? '#27500A'
                      : '#633806',
                }}
              >
                {(100 - forecastData.mape).toFixed(1)}%
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
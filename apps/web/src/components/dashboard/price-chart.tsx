'use client';

import { useEffect, useMemo } from 'react';
import { usePriceHistory, useRegions } from '@/hooks/use-prices';
import { useForecast }       from '@/hooks/use-forecasts';
import { useDashboardStore } from '@/store/dashboard.store';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3 text-sm shadow-sm"
        style={{
          background: 'var(--background)',
          border: '0.5px solid var(--border)',
        }}
      >
        <div className="font-medium mb-2">{label}</div>

        {payload.map((p: any) => {
          if (!p.value) return null;

          return (
            <div
              key={p.name}
              className="flex items-center gap-2 mb-1"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: p.color }}
              />

              <span style={{ color: 'var(--muted-foreground)' }}>
                {p.name === 'price'
                  ? 'Harga Aktual'
                  : p.name === 'predicted'
                    ? 'Harga Prediksi'
                    : 'Rentang Harga'}
                :
              </span>

              <span className="font-medium">
                Rp {Number(p.value).toLocaleString('id-ID')}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

function SkeletonChart() {
  return (
    <div
      className="rounded-xl p-5 animate-pulse"
      style={{
        background: 'var(--background)',
        border: '0.5px solid var(--border)',
      }}
    >
      <div
        className="h-4 w-48 rounded mb-2"
        style={{ background: 'var(--muted)' }}
      />

      <div
        className="h-3 w-32 rounded mb-6"
        style={{ background: 'var(--muted)' }}
      />

      <div
        className="h-60 rounded"
        style={{ background: 'var(--muted)' }}
      />
    </div>
  );
}

export function PriceChart() {
  const {
    selectedCommodityId,
    selectedRegionId,
  } = useDashboardStore();

  const { data: regions } = useRegions();

  const {
    data: historyData,
    isLoading,
  } = usePriceHistory(
    selectedCommodityId,
    selectedRegionId,
    14,
  );

  const {
    mutate,
    data: forecastData,
  } = useForecast();

  useEffect(() => {
    if (!selectedCommodityId || !selectedRegionId) return;

    mutate({
      commodity_id: selectedCommodityId,
      region_id: selectedRegionId,
    });
  }, [
    selectedCommodityId,
    selectedRegionId,
    mutate,
  ]);

  const selectedRegion = useMemo(() => {
    return regions?.find(
      (r: any) => r.id === selectedRegionId,
    );
  }, [regions, selectedRegionId]);

  if (isLoading) {
    return <SkeletonChart />;
  }

  // Historical data
  const historical = (historyData || []).map((r: any) => ({
    date: new Date(r.recordedAt).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short',
      },
    ),

    price: r.price,
    predicted: null,
    ci_low: null,
    ci_high: null,
    isForecast: false,
  }));

  // Forecast data
  const forecasts = (
    forecastData?.forecasts || []
  ).map((f: any) => ({
    date: new Date(f.date).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short',
      },
    ),

    price: null,
    predicted: f.predicted,
    ci_low: f.lower_bound,
    ci_high: f.upper_bound,
    isForecast: true,
  }));

  const chartData = [
    ...historical,
    ...forecasts,
  ];

  const todayLabel =
    historical[historical.length - 1]?.date;

  const mape = forecastData?.mape;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'var(--background)',
        border: '0.5px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium">
            Tren Harga & Forecast 7 Hari
          </h3>

          <p
            className="text-xs mt-0.5"
            style={{
              color: 'var(--muted-foreground)',
            }}
          >
            {selectedRegion?.name || 'Memuat wilayah'} ·
            {' '}
            14 hari historis + 7 hari prediksi
          </p>
        </div>

        <div
          className="flex items-center gap-4 text-xs"
          style={{
            color: 'var(--muted-foreground)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5"
              style={{ background: '#166534' }}
            />

            Aktual
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5 border-dashed border-t-2"
              style={{ borderColor: '#639922' }}
            />

            Prediksi
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-2 rounded-sm opacity-40"
              style={{ background: '#639922' }}
            />

            Rentang Estimasi
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer
        width="100%"
        height={240}
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
            interval={2}
          />

          <YAxis
            tick={{
              fontSize: 11,
              fill: 'var(--muted-foreground)',
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              `${(v / 1000).toFixed(0)}k`
            }
          />

          <Tooltip content={<CustomTooltip />} />

          {todayLabel && (
            <ReferenceLine
              x={todayLabel}
              stroke="#E24B4A"
              strokeDasharray="3 3"
              label={{
                value: 'Hari ini',
                fill: '#A32D2D',
                fontSize: 10,
                position: 'top',
              }}
            />
          )}

          {/* Confidence interval */}
          <Area
            type="monotone"
            dataKey="ci_high"
            fill="#639922"
            stroke="none"
            fillOpacity={0.1}
          />

          <Area
            type="monotone"
            dataKey="ci_low"
            fill="var(--background)"
            stroke="none"
            fillOpacity={1}
          />

          {/* Actual */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#166534"
            strokeWidth={2}
            dot={{
              r: 3,
              fill: '#166534',
            }}
            connectNulls={false}
          />

          {/* Forecast */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#639922"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{
              r: 3,
              fill: '#639922',
            }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div
        className="flex items-center gap-3 mt-3 pt-3 text-xs"
        style={{
          borderTop: '0.5px solid var(--border)',
          color: 'var(--muted-foreground)',
        }}
      >
        <span>
          Didukung oleh AI Predictive Analytics
        </span>

        {mape && (
          <>
            <span>·</span>

            <span>
              Margin Kesalahan:

              <span
                className="font-medium ml-1"
                style={{
                  color:
                    mape < 10
                      ? '#27500A'
                      : mape < 20
                        ? '#633806'
                        : '#A32D2D',
                }}
              >
                {mape}%
              </span>
            </span>
          </>
        )}

        <span style={{ marginLeft: 'auto' }}>
          Tingkat Kepercayaan Data: 80%
        </span>
      </div>
    </div>
  );
}
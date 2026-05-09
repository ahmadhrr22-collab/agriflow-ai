'use client';

import { useState, useEffect } from 'react';

import {
  useCommodities,
  useRegions,
} from '@/hooks/use-prices';

import { useForecast } from '@/hooks/use-forecasts';
import { useAnomalies } from '@/hooks/use-anomalies';

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
                : 'CI Range'}
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
      commodities?.length &&
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
      regions?.length &&
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
            Demand Forecast
          </h2>

          <p
            className="text-xs mt-0.5"
            style={{
              color:
                'var(--muted-foreground)',
            }}
          >
            Prediksi harga 7 hari ke depan ·
            Prophet + XGBoost Ensemble
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Commodity */}
          <select
            value={commodityId}
            onChange={(e) =>
              setCommodityId(
                e.target.value,
              )
            }
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{
              border:
                '0.5px solid var(--border)',
              background:
                'var(--background)',
            }}
          >
            {commodities?.map(
              (c: any) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.localName}
                </option>
              ),
            )}
          </select>

          {/* Region */}
          <select
            value={regionId}
            onChange={(e) =>
              setRegionId(
                e.target.value,
              )
            }
            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{
              border:
                '0.5px solid var(--border)',
              background:
                'var(--background)',
            }}
          >
            {regions?.map(
              (r: any) => (
                <option
                  key={r.id}
                  value={r.id}
                >
                  {r.name}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Model',
            value: 'Ensemble',
            sub: 'Prophet + XGBoost',
          },
          {
            label: 'MAPE',
            value: forecastData
              ? `${forecastData.mape}%`
              : '-',
            sub:
              forecastData?.mape < 10
                ? '✓ Akurasi tinggi'
                : 'Akurasi sedang',

            color:
              forecastData?.mape < 10
                ? '#27500A'
                : '#633806',
          },
          {
            label: 'Data Points',
            value: forecastData
              ? `${forecastData.data_points}`
              : '-',

            sub: 'Hari historis dipakai',
          },
          {
            label:
              'Anomali Terdeteksi',

            value: `${
              anomalyData?.total_anomalies ||
              0
            }`,

            sub: '30 hari terakhir',

            color:
              (
                anomalyData?.total_anomalies ||
                0
              ) > 0
                ? '#A32D2D'
                : '#27500A',
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4"
            style={{
              background:
                'var(--background)',

              border:
                '0.5px solid var(--border)',
            }}
          >
            <div
              className="text-xs mb-2"
              style={{
                color:
                  'var(--muted-foreground)',
              }}
            >
              {m.label}
            </div>

            <div
              className="text-xl font-medium mb-1"
              style={{
                color:
                  m.color ||
                  'var(--foreground)',
              }}
            >
              {m.value}
            </div>

            <div
              className="text-xs"
              style={{
                color:
                  'var(--muted-foreground)',
              }}
            >
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Remaining UI tetap sama */}
    </div>
  );
}
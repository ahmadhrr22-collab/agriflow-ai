'use client';

import { useEffect } from 'react';

import { MetricCards } from '@/components/dashboard/metric-cards';
import { PriceChart } from '@/components/dashboard/price-chart';
import { AlertPreview } from '@/components/dashboard/alert-preview';
import { RecommendationPreview } from '@/components/dashboard/recommendation-preview';
import { DataQualityBanner } from '@/components/dashboard/data-quality-banner';
import { GeminiInsight } from '@/components/dashboard/gemini-insight';

import {
  useCommodities,
  useRegions,
} from '@/hooks/use-prices';

import { useDashboardStore } from '@/store/dashboard.store';

function DashboardInit() {
  const { data: commodities } =
    useCommodities();

  const { data: regions } =
    useRegions();

  const { initializeIfEmpty } =
    useDashboardStore();

  useEffect(() => {
    if (
      commodities &&
      commodities.length > 0 &&
      regions &&
      regions.length > 0
    ) {
      // Cari Jakarta Pusat, fallback ke region pertama
      const jakartaPusat =
        regions.find(
          (r: any) =>
            r.name ===
            'Jakarta Pusat',
        );

      const cabaiMerah =
        commodities.find(
          (c: any) =>
            c.name === 'cabai-merah',
        );

      initializeIfEmpty(
        cabaiMerah?.id ||
          commodities[0].id,

        jakartaPusat?.id ||
          regions[0].id,
      );
    }
  }, [
    commodities,
    regions,
    initializeIfEmpty,
  ]);

  return null;
}

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardInit />

      {/* Greeting Header */}
      <div className="pb-1.5 border-b border-[rgba(230,224,210,0.5)]">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: '#0f4f2f' }}>
          Selamat Datang di Command Center
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Analisis supply, demand, dan pergerakan harga pangan nasional secara real-time
        </p>
      </div>

      <DataQualityBanner />

      <MetricCards />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <PriceChart />

          <GeminiInsight />
        </div>

        <div className="space-y-5">
          <AlertPreview />

          <RecommendationPreview />
        </div>
      </div>
    </div>
  );
}
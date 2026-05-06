import { MetricCards } from '@/components/dashboard/metric-cards';
import { PriceChart } from '@/components/dashboard/price-chart';
import { AlertPreview } from '@/components/dashboard/alert-preview';
import { RecommendationPreview } from '@/components/dashboard/recommendation-preview';
import { DataQualityBanner } from '@/components/dashboard/data-quality-banner';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DataQualityBanner />
      <MetricCards />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PriceChart />
        </div>
        <div className="space-y-6">
          <AlertPreview />
          <RecommendationPreview />
        </div>
      </div>
    </div>
  );
}
import { MetricCards }           from '@/components/dashboard/metric-cards';
import { PriceChart }            from '@/components/dashboard/price-chart';
import { AlertPreview }          from '@/components/dashboard/alert-preview';
import { RecommendationPreview } from '@/components/dashboard/recommendation-preview';
import { DataQualityBanner }     from '@/components/dashboard/data-quality-banner';
import { GeminiInsight }         from '@/components/dashboard/gemini-insight';

export default function DashboardPage() {
  return (
    <div className="space-y-5">
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
'use client';

import Link from 'next/link';
import { useAlerts } from '@/hooks/use-alerts';

type AlertPreviewItem = {
  id: string;
  title: string;
  message?: string;
  severity?: string;
  createdAt?: string;
  commodity?: { localName?: string };
  region?: { name?: string };
};

const severityConfig = {
  critical: { bg: '#FCEBEB', border: '#E24B4A', text: '#A32D2D' },
  high: { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' },
  warning: { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' },
  medium: { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' },
  low: { bg: '#E6F1FB', border: '#378ADD', text: '#0C447C' },
  info: { bg: '#E6F1FB', border: '#378ADD', text: '#0C447C' },
};

export function AlertPreview() {
  const { data, isLoading } = useAlerts();
  const alerts = ((data || []) as AlertPreviewItem[]).slice(0, 3);

  return (
    <div className="ag-card-strong p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold">Alert Terbaru</h3>
          <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Sinyal risiko dari data riil
          </p>
        </div>
        <Link href="/dashboard/alerts" className="ag-button px-2.5 py-1.5 text-xs font-bold">
          Lihat semua
        </Link>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          [1, 2, 3].map((index) => (
            <div key={index} className="h-16 rounded-lg animate-pulse" style={{ background: 'var(--muted)' }} />
          ))
        ) : alerts.length === 0 ? (
          <div className="ag-soft py-6 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Tidak ada alert saat ini
          </div>
        ) : (
          alerts.map((alert) => {
            const severity = String(alert.severity || 'info').toLowerCase();
            const cfg = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info;
            const createdAt = alert.createdAt ? new Date(alert.createdAt) : null;

            return (
              <div key={alert.id} className="ag-soft flex items-start gap-3 p-3">
                <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: cfg.border }} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate" style={{ color: cfg.text }}>
                    {alert.title}
                  </div>
                  <div className="text-xs mt-1 truncate" style={{ color: 'var(--muted-foreground)' }}>
                    {alert.region?.name || alert.message || alert.commodity?.localName || '-'}
                  </div>
                </div>
                <span className="text-[11px] shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                  {createdAt
                    ? createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                    : ''}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

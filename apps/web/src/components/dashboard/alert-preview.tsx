'use client';

import Link from 'next/link';
import { useAlerts } from '@/hooks/use-alerts';

type AlertPreviewItem = {
  id: string;
  title: string;
  message?: string;
  severity?: string;
  createdAt?: string;
  commodity?: {
    localName?: string;
  };
  region?: {
    name?: string;
  };
};

const severityConfig = {
  critical: { bg: '#FCEBEB', border: '#E24B4A', text: '#A32D2D' },
  high:     { bg: '#FCEBEB', border: '#E24B4A', text: '#A32D2D' },
  warning:  { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' },
  medium:   { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' },
  low:      { bg: '#E6F1FB', border: '#378ADD', text: '#0C447C' },
  info:     { bg: '#E6F1FB', border: '#378ADD', text: '#0C447C' },
};

export function AlertPreview() {
  const { data, isLoading } = useAlerts();
  const alerts = ((data || []) as AlertPreviewItem[]).slice(0, 3);

  return (
    <div className="rounded-xl p-4" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Alert Terbaru</h3>
        <Link href="/dashboard/alerts"
          className="text-xs font-medium"
          style={{color: '#166534'}}>
          Lihat semua →
        </Link>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg animate-pulse"
              style={{background: 'var(--muted)'}} />
          ))
        ) : alerts.length === 0 ? (
          <div className="text-xs text-center py-4"
            style={{color: 'var(--muted-foreground)'}}>
            Tidak ada alert saat ini
          </div>
        ) : (
          alerts.map((alert) => {
            const severity = String(alert.severity || 'info').toLowerCase();
            const cfg =
              severityConfig[severity as keyof typeof severityConfig] ||
              severityConfig.info;
            const createdAt = alert.createdAt ? new Date(alert.createdAt) : null;

            return (
              <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded-lg" style={{
                background: cfg.bg,
                borderLeft: `3px solid ${cfg.border}`,
                borderRadius: '0 8px 8px 0',
              }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{color: cfg.text}}>
                    {alert.title}
                  </div>
                  <div className="text-xs mt-0.5 truncate" style={{color: 'var(--muted-foreground)'}}>
                    {alert.region?.name || alert.message || alert.commodity?.localName || '-'}
                  </div>
                </div>
                <span className="text-xs shrink-0" style={{color: 'var(--muted-foreground)'}}>
                  {createdAt
                    ? createdAt.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                      })
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

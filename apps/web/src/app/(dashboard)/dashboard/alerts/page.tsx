'use client';

import { useState } from 'react';
import { useAlerts, useMarkAsRead, useDismissAlert, useUnreadCount } from '@/hooks/use-alerts';

type AlertItem = {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'SENT' | 'READ' | 'DISMISSED';
  title: string;
  message: string;
  createdAt: string;
  commodity?: { localName: string };
  region?: { name: string };
};

const severityConfig = {
  CRITICAL: { bg: '#FCEBEB', border: '#E24B4A', color: '#A32D2D', label: 'Kritis' },
  HIGH: { bg: '#FAEEDA', border: '#EF9F27', color: '#633806', label: 'Tinggi' },
  MEDIUM: { bg: '#FAEEDA', border: '#EF9F27', color: '#633806', label: 'Sedang' },
  LOW: { bg: '#E6F1FB', border: '#378ADD', color: '#0C447C', label: 'Rendah' },
};

const typeConfig: Record<string, string> = {
  PRICE_SPIKE: 'Lonjakan Harga',
  PRICE_DROP: 'Penurunan Harga',
  SUPPLY_SHORTAGE: 'Kekurangan Stok',
  DEMAND_SURGE: 'Lonjakan Demand',
  ANOMALY_DETECTED: 'Anomali Terdeteksi',
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: 'Menunggu', bg: '#F1EFE8', color: '#444441' },
  SENT: { label: 'Terkirim', bg: '#EAF3DE', color: '#27500A' },
  READ: { label: 'Dibaca', bg: '#F1EFE8', color: '#888780' },
  DISMISSED: { label: 'Diabaikan', bg: '#F1EFE8', color: '#888780' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  return 'Baru saja';
}

export default function AlertsPage() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { data: alerts, isLoading } = useAlerts(filter);
  const { data: realUnreadCount } = useUnreadCount();
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: dismiss } = useDismissAlert();

  const allAlerts = (alerts || []) as AlertItem[];
  const criticalCount = allAlerts.filter((alert) => alert.severity === 'CRITICAL').length;
  const unreadCount = realUnreadCount ?? allAlerts.filter((alert) => ['PENDING', 'SENT'].includes(alert.status)).length;

  return (
    <div className="space-y-5">
      <div className="ag-card-strong overflow-hidden">
        <div
          className="px-5 py-5"
          style={{
            background:
              'linear-gradient(135deg, rgba(15,79,47,0.96), rgba(31,122,77,0.88)), url(/agriculture-field.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',
          }}
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Real-time risk monitor
              </div>
              <h2 className="mt-2 text-2xl font-semibold">Alert Center</h2>
              <p className="mt-1 max-w-2xl text-sm text-white/72">
                Notifikasi anomali dan perubahan harga yang dihasilkan dari price records real.
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {['Semua', 'PENDING', 'READ', 'DISMISSED'].map((status) => {
                const active = filter === status || (status === 'Semua' && !filter);
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status === 'Semua' ? undefined : status)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold transition"
                    style={{
                      background: active ? '#ffffff' : 'rgba(255,255,255,0.12)',
                      color: active ? 'var(--ag-primary)' : '#ffffff',
                      border: '1px solid rgba(255,255,255,0.22)',
                    }}
                  >
                    {status === 'Semua' ? 'Semua' : statusConfig[status]?.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 divide-x" style={{ borderColor: 'var(--border)' }}>
          {[
            { label: 'Total Notifikasi', value: allAlerts.length, sub: 'semua status', color: 'var(--foreground)' },
            { label: 'Tindakan Tertunda', value: unreadCount, sub: 'perlu perhatian', color: unreadCount > 0 ? '#A32D2D' : 'var(--ag-primary)' },
            { label: 'Prioritas Kritis', value: criticalCount, sub: 'prioritas tinggi', color: criticalCount > 0 ? '#A32D2D' : 'var(--ag-primary)' },
            { label: 'Status Sistem', value: 'Aktif', sub: 'monitoring real-time', color: 'var(--ag-primary)' },
          ].map((metric) => (
            <div key={metric.label} className="p-5">
              <div className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--muted-foreground)' }}>
                {metric.label}
              </div>
              <div className="mt-3 text-2xl font-bold" style={{ color: metric.color }}>
                {metric.value}
              </div>
              <div className="mt-1 text-[11px] font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-28 rounded-lg animate-pulse" style={{ background: 'var(--muted)' }} />
          ))}
        </div>
      ) : allAlerts.length === 0 ? (
        <div className="ag-card p-10 text-center">
          <div className="text-sm font-semibold">Tidak ada alert</div>
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Sistem berjalan normal. Tidak ada anomali yang perlu diperhatikan.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {allAlerts.map((alert) => {
            const severity = severityConfig[alert.severity] || severityConfig.LOW;
            const status = statusConfig[alert.status];
            const isUnread = ['PENDING', 'SENT'].includes(alert.status);

            return (
              <div
                key={alert.id}
                className="ag-card-strong p-4 transition"
                style={{ borderLeft: `4px solid ${severity.border}` }}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: severity.border }} />
                      <h3 className="text-sm font-semibold">{alert.title}</h3>
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: severity.bg, color: severity.color }}>
                        {severity.label}
                      </span>
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                      {alert.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>{typeConfig[alert.type] || alert.type}</span>
                      {alert.commodity && <span>/ {alert.commodity.localName}</span>}
                      {alert.region && <span>/ {alert.region.name}</span>}
                      <span>/ {timeAgo(alert.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isUnread && (
                      <button
                        onClick={() => markRead(alert.id)}
                        className="ag-button px-3 py-2 text-xs font-semibold"
                        style={{ background: '#EAF3DE', color: 'var(--ag-primary)' }}
                      >
                        Tandai Dibaca
                      </button>
                    )}
                    {alert.status !== 'DISMISSED' && (
                      <button
                        onClick={() => dismiss(alert.id)}
                        className="ag-button px-3 py-2 text-xs font-semibold"
                      >
                        Abaikan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

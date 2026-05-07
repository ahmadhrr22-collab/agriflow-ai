'use client';

import { useState } from 'react';
import {
  useAlerts,
  useMarkAsRead,
  useDismissAlert
} from '@/hooks/use-alerts';

const severityConfig = {
  CRITICAL: {
    bg: '#FCEBEB',
    border: '#E24B4A',
    color: '#A32D2D',
    label: 'Kritis',
    dot: '#E24B4A'
  },
  HIGH: {
    bg: '#FAEEDA',
    border: '#EF9F27',
    color: '#633806',
    label: 'Tinggi',
    dot: '#EF9F27'
  },
  MEDIUM: {
    bg: '#FAEEDA',
    border: '#EF9F27',
    color: '#633806',
    label: 'Sedang',
    dot: '#EF9F27'
  },
  LOW: {
    bg: '#E6F1FB',
    border: '#378ADD',
    color: '#0C447C',
    label: 'Rendah',
    dot: '#378ADD'
  },
};

const typeConfig: Record<string, string> = {
  PRICE_SPIKE: 'Lonjakan Harga',
  PRICE_DROP: 'Penurunan Harga',
  SUPPLY_SHORTAGE: 'Kekurangan Stok',
  DEMAND_SURGE: 'Lonjakan Demand',
  ANOMALY_DETECTED: 'Anomali Terdeteksi',
};

const statusConfig: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  PENDING: {
    bg: '#F1EFE8',
    color: '#444441',
    label: 'Menunggu'
  },
  SENT: {
    bg: '#EAF3DE',
    color: '#27500A',
    label: 'Terkirim'
  },
  READ: {
    bg: '#F1EFE8',
    color: '#888780',
    label: 'Dibaca'
  },
  DISMISSED: {
    bg: '#F1EFE8',
    color: '#888780',
    label: 'Diabaikan'
  },
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

  const { mutate: markRead } = useMarkAsRead();
  const { mutate: dismiss } = useDismissAlert();

  const allAlerts = alerts || [];

  const criticalCount = allAlerts.filter(
    (a: any) => a.severity === 'CRITICAL'
  ).length;

  const unreadCount = allAlerts.filter(
    (a: any) => ['PENDING', 'SENT'].includes(a.status)
  ).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">
            Alert Center
          </h2>

          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Early warning system · Notifikasi anomali dan perubahan harga
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['Semua', 'PENDING', 'SENT', 'READ', 'DISMISSED'].map((s) => (
            <button
              key={s}
              onClick={() =>
                setFilter(s === 'Semua' ? undefined : s)
              }
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background:
                  (filter === s || (s === 'Semua' && !filter))
                    ? '#166534'
                    : 'var(--background)',

                color:
                  (filter === s || (s === 'Semua' && !filter))
                    ? 'white'
                    : 'var(--muted-foreground)',

                border: '0.5px solid var(--border)',
              }}
            >
              {s === 'Semua'
                ? 'Semua'
                : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Alert',
            value: `${allAlerts.length}`,
            sub: 'semua status',
            color: 'var(--foreground)',
          },
          {
            label: 'Belum Dibaca',
            value: `${unreadCount}`,
            sub: 'perlu perhatian',
            color:
              unreadCount > 0
                ? '#A32D2D'
                : '#27500A',
          },
          {
            label: 'Kritis',
            value: `${criticalCount}`,
            sub: 'prioritas tinggi',
            color:
              criticalCount > 0
                ? '#A32D2D'
                : '#27500A',
          },
          {
            label: 'Sistem',
            value: 'Aktif',
            sub: 'monitoring real-time',
            color: '#27500A',
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4"
            style={{
              background: 'var(--background)',
              border: '0.5px solid var(--border)',
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {m.label}
            </div>

            <div
              className="text-2xl font-medium mb-1"
              style={{ color: m.color }}
            >
              {m.value}
            </div>

            <div
              className="text-xs"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Alert list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl animate-pulse"
              style={{
                background: 'var(--muted)'
              }}
            ></div>
          ))}
        </div>
      ) : allAlerts.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: 'var(--background)',
            border: '0.5px solid var(--border)',
          }}
        >
          <div className="text-2xl mb-3">◆</div>

          <div className="text-sm font-medium mb-1">
            Tidak ada alert
          </div>

          <div
            className="text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Sistem berjalan normal. Tidak ada anomali yang perlu diperhatikan.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {allAlerts.map((alert: any) => {
            const sev =
              severityConfig[
                alert.severity as keyof typeof severityConfig
              ];

            const status = statusConfig[alert.status];

            const isUnread = ['PENDING', 'SENT'].includes(
              alert.status
            );

            return (
              <div
                key={alert.id}
                className="rounded-xl p-5 transition-all"
                style={{
                  background: 'var(--background)',
                  borderTop: `0.5px solid ${
                    isUnread
                      ? sev.border
                      : 'var(--border)'
                  }`,
                  borderRight: `0.5px solid ${
                    isUnread
                      ? sev.border
                      : 'var(--border)'
                  }`,
                  borderBottom: `0.5px solid ${
                    isUnread
                      ? sev.border
                      : 'var(--border)'
                  }`,
                  borderLeft: `3px solid ${sev.border}`,
                  borderRadius: '0 12px 12px 0',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: sev.dot }}
                      ></div>

                      <span className="text-sm font-medium">
                        {alert.title}
                      </span>

                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: sev.bg,
                          color: sev.color
                        }}
                      >
                        {sev.label}
                      </span>

                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: status.bg,
                          color: status.color
                        }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Message */}
                    <p
                      className="text-xs leading-relaxed mb-3"
                      style={{
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      {alert.message}
                    </p>

                    {/* Meta */}
                    <div
                      className="flex items-center gap-3 text-xs"
                      style={{
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      <span>
                        {typeConfig[alert.type] || alert.type}
                      </span>

                      {alert.commodity && (
                        <>
                          <span>·</span>
                          <span>
                            {alert.commodity.localName}
                          </span>
                        </>
                      )}

                      {alert.region && (
                        <>
                          <span>·</span>
                          <span>{alert.region.name}</span>
                        </>
                      )}

                      <span>·</span>

                      <span>
                        {timeAgo(alert.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isUnread && (
                      <button
                        onClick={() => markRead(alert.id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{
                          background: '#EAF3DE',
                          color: '#27500A',
                          border: '0.5px solid #C0DD97',
                        }}
                      >
                        Tandai Dibaca
                      </button>
                    )}

                    {alert.status !== 'DISMISSED' && (
                      <button
                        onClick={() => dismiss(alert.id)}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--muted-foreground)',
                          border: '0.5px solid var(--border)',
                        }}
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
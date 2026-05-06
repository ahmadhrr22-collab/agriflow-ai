import Link from 'next/link';

const alerts = [
  {
    id: 1,
    severity: 'critical',
    title: 'Anomali harga cabai',
    sub: 'Kramat Jati · Naik 22% / 3 hari',
    time: '2 jam lalu',
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Potensi shortage',
    sub: 'Jakarta Timur · Defisit 340 ton',
    time: '5 jam lalu',
  },
  {
    id: 3,
    severity: 'warning',
    title: 'Harga di atas baseline',
    sub: 'Bekasi · +18% vs rata-rata',
    time: '8 jam lalu',
  },
];

const severityConfig = {
  critical: { bg: '#FCEBEB', border: '#E24B4A', dot: '#E24B4A', text: '#A32D2D' },
  warning:  { bg: '#FAEEDA', border: '#EF9F27', dot: '#EF9F27', text: '#633806' },
  info:     { bg: '#E6F1FB', border: '#378ADD', dot: '#378ADD', text: '#0C447C' },
};

export function AlertPreview() {
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
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity as keyof typeof severityConfig];
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
                  {alert.sub}
                </div>
              </div>
              <span className="text-xs shrink-0" style={{color: 'var(--muted-foreground)'}}>
                {alert.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
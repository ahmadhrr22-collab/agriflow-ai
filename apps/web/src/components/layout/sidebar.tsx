'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUnreadCount } from '@/hooks/use-alerts';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: 'O' },
  { label: 'Heatmap', href: '/dashboard/heatmap', icon: 'H' },
  { label: 'Forecast', href: '/dashboard/forecast', icon: 'F' },
  { label: 'Anomali', href: '/dashboard/anomalies', icon: 'A' },
  { label: 'Rekomendasi', href: '/dashboard/recommendations', icon: 'R' },
  { label: 'Alert', href: '/dashboard/alerts', icon: '!' },
];

const bottomItems = [
  { label: 'Pengaturan', href: '/dashboard/settings', icon: 'S' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: unreadCount } = useUnreadCount();

  return (
    <aside
      className="w-[248px] h-screen flex flex-col shrink-0 px-4 py-4"
      style={{
        background: 'rgba(255, 253, 247, 0.86)',
        borderRight: '1px solid rgba(230, 224, 210, 0.88)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="ag-card-strong p-3">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0f4f2f, #1f7a4d)',
              color: '#ffffff',
              boxShadow: '0 10px 22px rgba(15, 79, 47, 0.22)',
            }}
          >
            <span className="text-sm font-semibold">AG</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-none">AgriFlow AI</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Supply Chain Intel
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 ag-soft px-3 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: 'var(--ag-primary)' }}>
            Data pipeline
          </span>
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#1f7a4d' }} />
        </div>
        <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          PIHPS real data, update 08.00 WIB
        </div>
      </div>

      <nav className="mt-5 flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 text-sm transition-all"
              style={{
                borderRadius: 8,
                background: isActive ? '#0f4f2f' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--muted-foreground)',
                fontWeight: isActive ? 600 : 500,
                boxShadow: isActive ? '0 12px 24px rgba(15, 79, 47, 0.18)' : 'none',
              }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center text-[11px] font-semibold"
                style={{
                  borderRadius: 7,
                  background: isActive ? 'rgba(255,255,255,0.16)' : 'rgba(15, 79, 47, 0.07)',
                  color: isActive ? '#ffffff' : 'var(--ag-primary)',
                }}
              >
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.label === 'Alert' && Boolean(unreadCount) && (
                <span
                  className="min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.18)' : '#FCEBEB',
                    color: isActive ? '#ffffff' : '#A32D2D',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium"
            style={{ color: 'var(--muted-foreground)', borderRadius: 8 }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center text-[11px] font-semibold"
              style={{ background: 'rgba(15, 79, 47, 0.07)', color: 'var(--ag-primary)', borderRadius: 7 }}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}

        <div className="ag-card flex items-center gap-3 p-3">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background: '#EAF3DE', color: 'var(--ag-primary)' }}
          >
            AN
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate">Analyst</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
              analyst@agriflow.ai
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

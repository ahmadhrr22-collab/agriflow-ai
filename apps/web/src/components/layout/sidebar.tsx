'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Overview',       href: '/dashboard',                icon: '◈' },
  { label: 'Heatmap',        href: '/dashboard/heatmap',        icon: '◉' },
  { label: 'Forecast',       href: '/dashboard/forecast',       icon: '◌' },
  { label: 'Anomali',        href: '/dashboard/anomalies',      icon: '◎' },
  { label: 'Rekomendasi',    href: '/dashboard/recommendations', icon: '◍' },
  { label: 'Alert',          href: '/dashboard/alerts',         icon: '◆' },
];

const bottomItems = [
  { label: 'Pengaturan', href: '/dashboard/settings', icon: '◇' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] h-screen flex flex-col shrink-0" style={{
      background: 'var(--background)',
      borderRight: '0.5px solid var(--border)',
    }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4" style={{borderBottom: '0.5px solid var(--border)'}}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{background: '#166534'}}>
          <span className="text-white font-medium text-sm">AG</span>
        </div>
        <div>
          <div className="text-sm font-medium leading-none">AgriFlow AI</div>
          <div className="text-xs mt-1" style={{color: 'var(--muted-foreground)'}}>
            Supply Chain Intel
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="mx-3 my-2 px-3 py-2 rounded-lg flex items-center gap-2" style={{background: '#EAF3DE'}}>
        <div className="w-1.5 h-1.5 rounded-full" style={{background: '#166534'}}></div>
        <span className="text-xs font-medium" style={{color: '#27500A'}}>Data live · 07.00 WIB</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: isActive ? '#EAF3DE' : 'transparent',
                color: isActive ? '#166534' : 'var(--muted-foreground)',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <span style={{fontSize: '12px'}}>{item.icon}</span>
              {item.label}
              {item.label === 'Alert' && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{background: '#FCEBEB', color: '#A32D2D'}}>
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3" style={{borderTop: '0.5px solid var(--border)'}}>
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
            style={{color: 'var(--muted-foreground)'}}
          >
            <span style={{fontSize: '12px'}}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer"
          style={{background: 'var(--muted)'}}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
            style={{background: '#EAF3DE', color: '#166534'}}>
            AN
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">Analyst</div>
            <div className="text-xs truncate" style={{color: 'var(--muted-foreground)'}}>
              analyst@agriflow.ai
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
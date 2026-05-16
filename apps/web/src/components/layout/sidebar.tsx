'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUnreadCount } from '@/hooks/use-alerts';
import { useState } from 'react';

import {
  LayoutDashboard,
  Map,
  LineChart,
  Activity,
  Network,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Heatmap', href: '/dashboard/heatmap', icon: Map },
  { label: 'Forecast', href: '/dashboard/forecast', icon: LineChart },
  { label: 'Anomali', href: '/dashboard/anomalies', icon: Activity },
  { label: 'Rekomendasi', href: '/dashboard/recommendations', icon: Network },
  { label: 'Alert', href: '/dashboard/alerts', icon: Bell },
];

const bottomItems = [
  { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: unreadCount } = useUnreadCount();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <aside
      className="w-[248px] h-screen flex flex-col shrink-0 px-4 py-4"
      style={{
        background: 'rgba(255, 253, 247, 0.86)',
        borderRight: '1px solid rgba(230, 224, 210, 0.88)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="p-1 mb-2">
        <div className="flex items-center gap-1">
          <img src="/agriflow-logo.png" alt="Agriflow Logo" className="h-20 w-auto object-contain" />
          <span className="text-xl font-bold -ml-3 -mt-1 text-gray-900">Agriflow.</span>
        </div>
      </div>

      <nav className="mt-5 flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          const Icon = item.icon;

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
                <Icon size={14} strokeWidth={2.5} />
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
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
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
              <Icon size={14} strokeWidth={2.5} />
            </span>
            {item.label}
          </Link>
        )})}

        <div className="ag-card flex items-center gap-3 p-2.5 transition-all">
          <div
            className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#EAF3DE', color: 'var(--ag-primary)' }}
          >
            AN
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate">Analyst</div>
            <div className="text-[11px] font-medium truncate" style={{ color: 'var(--muted-foreground)' }}>
              analyst@agriflow.ai
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="shrink-0 flex items-center justify-center h-8 w-8 rounded-md transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Keluar dari sistem"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div 
            className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
              <LogOut size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Keluar dari sesi?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Anda akan dikembalikan ke halaman utama dan harus masuk kembali untuk melihat dashboard.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Batal
              </button>
              <button 
                onClick={() => router.push('/')}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-white"
                style={{ background: '#A32D2D' }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

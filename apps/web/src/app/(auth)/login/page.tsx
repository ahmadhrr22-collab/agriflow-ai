'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Email atau password salah.');
        return;
      }

      const data = await res.json();

      localStorage.setItem('agriflow_token', data.access_token);

      router.push('/dashboard');
    } catch {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--muted)' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: '#0A3D1F' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#166534' }}
          >
            <span className="text-white font-medium text-sm">AG</span>
          </div>

          <span className="text-white font-medium">AgriFlow AI</span>
        </div>

        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#97C459' }}
            ></div>

            <span
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Platform Kecerdasan Pangan Indonesia
            </span>
          </div>

          <h1 className="text-3xl font-medium text-white leading-tight mb-4">
            Distribusi pangan
            <br />
            yang lebih cerdas.
          </h1>

          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Data supply chain real-time, prediksi demand 7 hari, dan deteksi
            anomali harga untuk pengambilan keputusan distribusi yang lebih
            baik.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { val: '83%', label: 'Akurasi prediksi' },
            { val: '3 kota', label: 'Region aktif' },
            { val: '1 komoditas', label: 'MVP scope' },
          ].map((s) => (
            <div
              key={s.label}
              className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div className="text-lg font-medium text-white">{s.val}</div>

              <div
                className="text-xs mt-0.5"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#166534' }}
            >
              <span className="text-white font-medium text-xs">AG</span>
            </div>

            <span className="font-medium">AgriFlow AI</span>
          </div>

          <h2 className="text-xl font-medium mb-1">
            Masuk ke dashboard
          </h2>

          <p
            className="text-sm mb-8"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Gunakan akun yang diberikan oleh administrator.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@agriflow.ai"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                style={{
                  border: '0.5px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  border: '0.5px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            {error && (
              <div
                className="px-3 py-2.5 rounded-lg text-xs"
                style={{
                  background: '#FCEBEB',
                  color: '#A32D2D',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity"
              style={{
                background: '#166534',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div
            className="mt-6 p-3 rounded-lg text-xs"
            style={{
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
            }}
          >
            <div
              className="font-medium mb-1"
              style={{ color: 'var(--foreground)' }}
            >
              Demo credentials
            </div>

            <div>analyst@agriflow.ai / password123</div>
          </div>

          <p
            className="text-xs mt-6 text-center"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Butuh akses?{' '}
            <span
              className="font-medium cursor-pointer"
              style={{ color: '#166534' }}
            >
              Hubungi administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
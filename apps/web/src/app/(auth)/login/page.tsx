'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
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
    <main className="min-h-screen ag-shell p-5">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-6xl grid-cols-1 overflow-hidden rounded-[10px] border bg-white shadow-2xl lg:grid-cols-[1.08fr_0.92fr]" style={{ borderColor: 'var(--border)' }}>
        <section
          className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(15,79,47,0.18), rgba(15,79,47,0.88)), url(/agriculture-field.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-semibold bg-white/16">
              AG
            </div>
            <span className="font-semibold">AgriFlow AI</span>
          </div>

          <div className="max-w-xl">
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-semibold text-white/80">
              Food supply intelligence
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Monitor, predict, and move food supply with confidence.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/72">
              Dashboard operasional untuk harga pangan, alert anomali, forecast,
              dan rekomendasi distribusi berbasis data real.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '34', label: 'Provinsi' },
              { value: '5', label: 'Komoditas' },
              { value: '08.00', label: 'Update WIB' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/16 bg-white/12 p-4 backdrop-blur">
                <div className="text-2xl font-semibold text-white">{item.value}</div>
                <div className="mt-1 text-xs text-white/62">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--ag-primary)' }}>
                AG
              </div>
              <span className="font-semibold">AgriFlow AI</span>
            </div>

            <div className="ag-chip mb-5 px-3 py-1.5">Secure workspace</div>
            <h2 className="text-3xl font-semibold tracking-tight">Masuk ke dashboard</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gunakan akun analyst untuk mengakses command center.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="analyst@agriflow.ai"
                  required
                  className="ag-button w-full px-3 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="password123"
                  required
                  className="ag-button w-full px-3 py-3 text-sm outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-opacity"
                style={{
                  background: 'var(--ag-primary)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="ag-soft mt-6 p-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <div className="mb-1 font-semibold" style={{ color: 'var(--foreground)' }}>
                Demo credentials
              </div>
              analyst@agriflow.ai / password123
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

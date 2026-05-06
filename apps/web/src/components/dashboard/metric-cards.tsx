const metrics = [
  {
    label: 'Harga Cabai — Jakarta',
    value: 'Rp 38.500',
    delta: '+12%',
    deltaLabel: 'vs minggu lalu',
    trend: 'up',
    sub: 'Di atas rata-rata nasional',
  },
  {
    label: 'Estimasi Surplus Jabar',
    value: '2.400 ton',
    delta: '+340 ton',
    deltaLabel: 'vs estimasi minggu lalu',
    trend: 'up',
    sub: 'Stok aman untuk 2 minggu',
  },
  {
    label: 'Anomali Aktif',
    value: '3',
    delta: '+2',
    deltaLabel: 'dari kemarin',
    trend: 'down',
    sub: '1 kritis, 2 waspada',
  },
  {
    label: 'Akurasi Prediksi',
    value: '83%',
    delta: '-2%',
    deltaLabel: 'vs minggu lalu',
    trend: 'neutral',
    sub: 'Berdasarkan 7 hari terakhir',
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl p-4" style={{
          background: 'var(--background)',
          border: '0.5px solid var(--border)',
        }}>
          <div className="text-xs mb-3" style={{color: 'var(--muted-foreground)'}}>
            {m.label}
          </div>
          <div className="text-2xl font-medium mb-1">{m.value}</div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{
              background: m.trend === 'up' ? '#EAF3DE'
                : m.trend === 'down' ? '#FCEBEB'
                : 'var(--muted)',
              color: m.trend === 'up' ? '#27500A'
                : m.trend === 'down' ? '#A32D2D'
                : 'var(--muted-foreground)',
            }}>
              {m.delta}
            </span>
            <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {m.deltaLabel}
            </span>
          </div>
          <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
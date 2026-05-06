import Link from 'next/link';

const recommendations = [
  {
    id: 1,
    from: 'Garut',
    to: 'Jakarta Timur',
    score: 0.87,
    reason: 'Surplus +34%, defisit -28%',
  },
  {
    id: 2,
    from: 'Majalengka',
    to: 'Jakarta Barat',
    score: 0.74,
    reason: 'Selisih harga Rp 4.200/kg',
  },
];

export function RecommendationPreview() {
  return (
    <div className="rounded-xl p-4" style={{
      background: 'var(--background)',
      border: '0.5px solid var(--border)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Rekomendasi</h3>
        <Link href="/dashboard/recommendations"
          className="text-xs font-medium"
          style={{color: '#166634'}}>
          Lihat semua →
        </Link>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-3 rounded-lg" style={{
            background: 'var(--muted)',
            border: '0.5px solid var(--border)',
          }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-medium">
                {rec.from}
                <span className="mx-1.5" style={{color: '#166534'}}>→</span>
                {rec.to}
              </div>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{
                background: '#EAF3DE',
                color: '#27500A',
              }}>
                {(rec.score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-xs" style={{color: 'var(--muted-foreground)'}}>
              {rec.reason}
            </div>
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{background: 'var(--border)'}}>
              <div className="h-full rounded-full" style={{
                width: `${rec.score * 100}%`,
                background: '#639922',
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
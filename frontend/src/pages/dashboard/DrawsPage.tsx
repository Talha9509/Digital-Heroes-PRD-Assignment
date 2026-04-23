import { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface Winner {
  id: string;
  userId: string;
  matchType: 'MATCH_5' | 'MATCH_4' | 'MATCH_3';
  prizeAmount: number;
}

interface Draw {
  id: string;
  year: number;
  month: number;
  drawnNumbers: number[];
  prizePoolTotal: number;
  jackpotPool: number;
  winners: Winner[];
}

export default function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Draw[]>('/draws')
      .then(setDraws)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading draws...</div>;

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
          Monthly draws
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Every month, a new set of numbers is drawn and prize pools are
          distributed across 5, 4 and 3‑number matches.[file:1]
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {draws.map((d) => (
          <div key={d.id} className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.9rem' }}>
                  {d.month}/{d.year}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--muted)',
                  }}
                >
                  Prize pool: ₹{(d.prizePoolTotal / 100).toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.3rem',
                  alignItems: 'center',
                }}
              >
                {d.drawnNumbers.map((n) => (
                  <span
                    key={n}
                    style={{
                      display: 'inline-flex',
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--accent-soft)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {d.winners.length > 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                {d.winners.length} winners across all tiers.
              </p>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                No winners this month. Jackpot carries forward.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
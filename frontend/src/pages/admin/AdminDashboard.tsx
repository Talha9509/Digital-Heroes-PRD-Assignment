import { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface Stats {
  totalUsers: number;
  totalPrizePool: number;
  totalCharityContributions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>('/admin/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 780 }}>
      <div className="card">
        <h1 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
          Admin overview
        </h1>
        {stats ? (
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '1rem',
              fontSize: '0.9rem',
            }}
          >
            <div>
              <div style={{ color: 'var(--muted)' }}>Total users</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {stats.totalUsers}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>Prize pool total</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                ₹{(stats.totalPrizePool / 100).toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>
                Charity contributions
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                ₹{(stats.totalCharityContributions / 100).toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading stats...</p>
        )}
      </div>
    </div>
  );
}
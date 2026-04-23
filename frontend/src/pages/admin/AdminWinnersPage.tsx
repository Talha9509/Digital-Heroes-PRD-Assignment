import { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface Winner {
  id: string;
  user: { email: string };
  matchType: string;
  prizeAmount: number;
  verificationStatus: string;
  paymentStatus: string;
}

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);

  const load = () => {
    api.get<Winner[]>('/winners/admin').then(setWinners).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const updateVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await api.post(`/winners/${id}/verify`, { status });
    load();
  };

  const markPaid = async (id: string) => {
    await api.post(`/winners/${id}/pay`);
    load();
  };

  return (
    <div className="card">
      <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
        Winners
      </h1>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          marginTop: '0.6rem',
        }}
      >
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
            <th>User</th>
            <th>Tier</th>
            <th>Prize</th>
            <th>Verification</th>
            <th>Payout</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((w) => (
            <tr key={w.id}>
              <td>{w.user.email}</td>
              <td>{w.matchType}</td>
              <td>₹{(w.prizeAmount / 100).toLocaleString()}</td>
              <td>{w.verificationStatus}</td>
              <td>{w.paymentStatus}</td>
              <td>
                <button
                  className="secondary-button"
                  onClick={() => updateVerify(w.id, 'APPROVED')}
                >
                  Approve
                </button>{' '}
                <button
                  className="secondary-button"
                  onClick={() => updateVerify(w.id, 'REJECTED')}
                >
                  Reject
                </button>{' '}
                <button
                  className="secondary-button"
                  onClick={() => markPaid(w.id)}
                >
                  Mark paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
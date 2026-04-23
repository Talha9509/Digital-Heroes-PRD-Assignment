import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface StatusResponse {
  subscriptionStatus: 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  subscriptionPlan?: string | null;
  subscriptionCurrentPeriodEnd?: string | null;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    try {
      const data = await api.get<StatusResponse>('/subscription/status');
      setStatus(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const startCheckout = async (plan: 'monthly' | 'yearly') => {
    const res = await api.post<{ url: string }>(
      '/subscription/checkout',
      { plan },
    );
    window.location.href = res.url;
  };

  return (
    <div style={{ display: 'grid', gap: '1.2rem' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
          Welcome, {user?.email}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Track your rounds, enter the draw, and keep your causes funded
          every month.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)' }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>
            Subscription status
          </h2>
          {loading || !status ? (
            <p>Loading subscription...</p>
          ) : status.subscriptionStatus === 'ACTIVE' ? (
            <>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                Your subscription is active on the{' '}
                <strong>{status.subscriptionPlan}</strong> plan.
              </p>
              {status.subscriptionCurrentPeriodEnd && (
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Current period ends:{' '}
                  {new Date(
                    status.subscriptionCurrentPeriodEnd,
                  ).toLocaleDateString()}
                </p>
              )}
            </>
          ) : (
            <>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                You’re not currently subscribed. Activate your plan to
                join the next draw and power monthly donations.
              </p>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
                <button
                  className="primary-button"
                  onClick={() => startCheckout('monthly')}
                >
                  Start monthly
                </button>
                <button
                  className="secondary-button"
                  onClick={() => startCheckout('yearly')}
                >
                  Start yearly
                </button>
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>
            Quick links
          </h2>
          <ul style={{ paddingLeft: '1.1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
            <li>Enter or edit your last five scores.</li>
            <li>Choose or switch your charity partner.</li>
            <li>Review draw outcomes and past winnings.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
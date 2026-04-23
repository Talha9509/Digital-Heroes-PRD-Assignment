import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface Charity {
  id: string;
  name: string;
  description: string;
}

export default function CharityPage() {
  const { user } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pct, setPct] = useState(10);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.get<Charity[]>('/charities').then(setCharities);
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPct(user.subscriptionStatus === 'ACTIVE' ? user.subscriptionPlan ? 10 : 10 : 10);
    }
  }, [user]);

  const save = async () => {
    if (!user || !selectedId) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.patch(`/admin/users/${user.id}`, {
        selectedCharityId: selectedId,
        charityContributionPct: pct,
      });
      setMessage('Charity preferences saved.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setMessage(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
          Your charity impact
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Choose which charity receives your monthly contribution and
          adjust your percentage (minimum 10%).[file:1]
        </p>
      </div>

      <div className="card">
        <div className="input-group">
          <label className="input-label">Charity</label>
          <select
            className="input-field"
            value={selectedId ?? ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
          >
            <option value="">Select a charity</option>
            {charities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginTop: '0.8rem' }}>
          <label className="input-label">
            Contribution percentage (min 10%)
          </label>
          <input
            className="input-field"
            type="number"
            min={10}
            max={100}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
          />
        </div>

        <button
          className="primary-button"
          style={{ marginTop: '1rem' }}
          disabled={saving || !selectedId}
          onClick={save}
        >
          {saving ? 'Saving...' : 'Save preferences'}
        </button>

        {message && (
          <div
            style={{
              marginTop: '0.7rem',
              fontSize: '0.8rem',
              color: 'var(--muted)',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
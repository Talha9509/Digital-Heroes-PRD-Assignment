import { useEffect, useState } from 'react';
import type {FormEvent} from 'react'
import { api } from '../../api/client';

interface Score {
  id: string;
  date: string;
  score: number;
}

export default function ScorePage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [date, setDate] = useState('');
  const [score, setScore] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScores = async () => {
    try {
      const data = await api.get<Score[]>('/scores');
      setScores(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load scores';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadScores();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/scores', { date, score: Number(score) });
      setDate('');
      setScore(30);
      await loadScores();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save score';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
          Your recent scores
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Only your latest five Stableford scores are stored at any time,
          with one score per date.[file:1]
        </p>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr auto',
            gap: '0.7rem',
            alignItems: 'flex-end',
          }}
        >
          <div className="input-group">
            <label className="input-label">Date</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Stableford score (1–45)</label>
            <input
              type="number"
              className="input-field"
              min={1}
              max={45}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              required
            />
          </div>
          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save score'}
          </button>
        </div>
        {error && <div className="error-text">{error}</div>}
      </form>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>
          Last 5 scores
        </h2>
        {loading ? (
          <p>Loading scores...</p>
        ) : scores.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            No scores yet. Start by adding your most recent round.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {scores.map((s) => (
              <li
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontSize: '0.9rem',
                }}
              >
                <span>
                  {new Date(s.date).toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span style={{ fontWeight: 600 }}>{s.score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
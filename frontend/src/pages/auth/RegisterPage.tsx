import type { FormEvent } from 'react';
import {  useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

interface Charity {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('user5@example.com');
  const [password, setPassword] = useState('User5@Pass123');
  const [name, setName] = useState('New Player');
  const [charities, setCharities] = useState<Charity[]>([]);
  const [charityId, setCharityId] = useState<string | null>(null);
  const [pct, setPct] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get<Charity[]>('/charities')
      .then(setCharities)
      .catch(() => {});
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', {
        email,
        password,
        name,
        charityId,
        charityContributionPct: pct,
      });
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="card" style={{ width: 420 }} onSubmit={onSubmit}>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
          Join the impact draw
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          One subscription unlocks score tracking, monthly draws and
          ongoing donations.[file:1]
        </p>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Preferred charity (optional)</label>
            <select
              className="input-field"
              value={charityId ?? ''}
              onChange={(e) =>
                setCharityId(e.target.value || null)
              }
            >
              <option value="">I’ll choose later</option>
              {charities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">
              Charity contribution percentage (min 10%)
            </label>
            <input
              className="input-field"
              type="number"
              min={10}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              required
            />
          </div>

          {error && <div className="error-text">{error}</div>}
        </div>

        <button
          type="submit"
          className="primary-button full-width"
          style={{ marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <p
          style={{
            marginTop: '0.8rem',
            fontSize: '0.8rem',
            color: 'var(--muted)',
          }}
        >
          Already a member? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
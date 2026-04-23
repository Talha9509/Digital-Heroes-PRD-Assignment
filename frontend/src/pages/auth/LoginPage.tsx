import type { FormEvent } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LocationState {
  from?: Location;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const from = state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('user1@example.com');
  const [password, setPassword] = useState('User1@Pass123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="card" style={{ width: 360 }} onSubmit={onSubmit}>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Log in to manage your scores, draws and impact.
        </p>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
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
          {error && <div className="error-text">{error}</div>}
        </div>

        <button
          type="submit"
          className="primary-button full-width"
          style={{ marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p
          style={{
            marginTop: '0.8rem',
            fontSize: '0.8rem',
            color: 'var(--muted)',
          }}
        >
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
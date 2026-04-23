// src/layouts/PublicLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <header className="shell-header">
        <Link to="/" className="logo">
          impact<span>draw</span>
        </Link>
        <nav className="shell-nav">
          <Link to="/charities">Charities</Link>
          <Link to="/how-it-works">How it works</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="primary-button">
                Join now
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
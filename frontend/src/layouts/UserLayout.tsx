// src/layouts/UserLayout.tsx
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="center">Loading...</div>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Member Portal</div>
          <div className="sidebar-email">{user.email}</div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/scores">Scores</Link>
          <Link to="/dashboard/charity">Charity</Link>
          <Link to="/dashboard/draws">Draws</Link>
          <Link to="/dashboard/winnings">Winnings</Link>
        </nav>
        <button className="secondary-button full-width" onClick={logout}>
          Log out
        </button>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
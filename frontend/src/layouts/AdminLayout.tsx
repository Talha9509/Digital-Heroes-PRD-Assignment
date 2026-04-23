// src/layouts/AdminLayout.tsx
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="center">Loading...</div>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return (
    <div className="dashboard-shell">
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Admin Console</div>
          <div className="sidebar-email">{user.email}</div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin">Overview</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/charities">Charities</Link>
          <Link to="/admin/draws">Draws</Link>
          <Link to="/admin/winners">Winners</Link>
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
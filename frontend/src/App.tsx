import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CharitiesPublicPage from './pages/CharitiesPublicPage';

import UserDashboard from './pages/dashboard/UserDashboard';
import ScorePage from './pages/dashboard/ScorePage';
import CharityPage from './pages/dashboard/CharityPage';
import DrawsPage from './pages/dashboard/DrawsPage';
import WinningsPage from './pages/dashboard/WinningsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import AdminCharitiesPage from './pages/admin/AdminCharitiesPage';
import AdminDrawsPage from './pages/admin/AdminDrawsPage';
import AdminWinnersPage from './pages/admin/AdminWinnersPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/charities" element={<CharitiesPublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/scores" element={<ScorePage />} />
        <Route path="/dashboard/charity" element={<CharityPage />} />
        <Route path="/dashboard/draws" element={<DrawsPage />} />
        <Route path="/dashboard/winnings" element={<WinningsPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/charities" element={<AdminCharitiesPage />} />
        <Route path="/admin/draws" element={<AdminDrawsPage />} />
        <Route path="/admin/winners" element={<AdminWinnersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
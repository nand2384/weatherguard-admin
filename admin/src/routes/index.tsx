import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Login } from '../pages/Login';
import { CompleteProfile } from '../pages/CompleteProfile';
import { Dashboard as AdminDashboard } from '../pages/Dashboard';
import { UserDashboard } from '../pages/UserDashboard';
import { Waiting } from '../pages/Waiting';
import { NotFound } from '../pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'ADMIN' ? "/admin" : "/dashboard"} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/rejected" element={<Waiting isRejected />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<RootRedirect />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/Loader';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader size={40} className="text-slate-900" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle routing based on approval status
  if (user.approvalStatus === 'INCOMPLETE' && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  if (user.approvalStatus === 'PENDING' && location.pathname !== '/waiting') {
    return <Navigate to="/waiting" replace />;
  }

  if (user.approvalStatus === 'REJECTED' && location.pathname !== '/rejected') {
    return <Navigate to="/rejected" replace />;
  }

  if (user.approvalStatus === 'APPROVED') {
    if (location.pathname === '/admin' && user.role !== 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }

    // Auto-redirect admins from the default dashboard to admin dashboard
    if (location.pathname === '/dashboard' && user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }

    // If approved user tries to visit onboarding pages, redirect them to dashboard
    if (['/complete-profile', '/waiting', '/rejected'].includes(location.pathname)) {
      return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
    }
  }

  return <Outlet />;
}

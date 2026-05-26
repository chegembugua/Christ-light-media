import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute() {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userData?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/ui/BottomNav';

export default function ProtectedRoute() {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pb-24">
      <Outlet />
      <BottomNav />
    </div>
  );
}


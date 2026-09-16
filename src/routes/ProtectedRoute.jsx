import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/ui/AppShell';

export default function ProtectedRoute() {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}


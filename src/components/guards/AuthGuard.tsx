import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

export default function AuthGuard() {
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

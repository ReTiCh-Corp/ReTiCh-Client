import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

export default function OnboardingGuard() {
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/register" replace />;
  }

  if (user.onboarding) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}

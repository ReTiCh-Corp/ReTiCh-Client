import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';

export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await loginUser(email, password);
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);

      if (!res.user.onboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/chat', { replace: true });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { login, isSubmitting, error };
}

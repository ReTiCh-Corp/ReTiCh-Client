import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';

export function useRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  const register = async (email: string, password: string) => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await registerUser(email, password);
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);

      if (!res.user.onboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/chat', { replace: true });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { register, isSubmitting, error };
}

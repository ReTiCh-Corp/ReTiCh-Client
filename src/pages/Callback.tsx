import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@retish/auth/react';
import { useAuthStore } from '../stores/useAuthStore';
import { apiClient } from '../api/client';
import { USER_ENDPOINTS } from '../api/endpoints';
import CallbackBackground from '../components/callback/CallbackBackground';
import CallbackBrandMark from '../components/callback/CallbackBrandMark';
import CallbackVerifying from '../components/callback/CallbackVerifying';
import CallbackSuccess from '../components/callback/CallbackSuccess';
import CallbackError from '../components/callback/CallbackError';

interface CreateUserResponse {
  id: string;
  email: string;
  onboarding_completed: boolean;
  is_new_user: boolean;
}

type CallbackPhase = 'verifying' | 'success' | 'error';

export default function Callback() {
  const { t } = useTranslation();
  const { handleRedirectResult, getAccessToken } = useAuth();
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<CallbackPhase>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function processCallback() {
      try {
        const user = await handleRedirectResult();

        if (!user) {
          setPhase('error');
          setErrorMessage(t('callback.noSession'));
          return;
        }

        const accessToken = await getAccessToken();

        if (accessToken) {
          setTokens(accessToken, '');
        }

        const userId = user.id || user.user_id;
        const userResponse = await apiClient<CreateUserResponse>(
          USER_ENDPOINTS.LIST,
          {
            method: 'POST',
            body: { id: userId, email: user.email },
          },
        );

        setUser({
          id: userResponse.id,
          email: userResponse.email,
          username: userResponse.email.split('@')[0],
          onboarding: userResponse.onboarding_completed,
        });

        setPhase('success');

        const destination = userResponse.onboarding_completed ? '/' : '/onboarding';
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1800);
      } catch (err) {
        setPhase('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : t('callback.verifyFailed'),
        );
      }
    }

    processCallback();
  }, [handleRedirectResult, getAccessToken, setTokens, setUser, navigate]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-grey-50 relative overflow-hidden">
      <CallbackBackground />

      <div className="relative z-10 w-full max-w-sm mx-4 animate-callback-card-in">
        <div className="bg-white rounded-3xl shadow-xl shadow-grey-200/60 border border-border-light px-8 py-12 text-center">
          <CallbackBrandMark />

          {phase === 'verifying' && <CallbackVerifying />}
          {phase === 'success' && <CallbackSuccess />}
          {phase === 'error' && (
            <CallbackError
              message={errorMessage}
              onRetry={() => navigate('/login', { replace: true })}
            />
          )}
        </div>

        <p className="text-center text-xs text-text-light mt-6">
          {t('callback.secureAuth')}
        </p>
      </div>
    </div>
  );
}

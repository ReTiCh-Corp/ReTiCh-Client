import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@retish/auth/react';
import { useAuthStore } from '../stores/useAuthStore';
import CallbackBackground from '../components/callback/CallbackBackground';
import CallbackBrandMark from '../components/callback/CallbackBrandMark';
import CallbackVerifying from '../components/callback/CallbackVerifying';
import CallbackSuccess from '../components/callback/CallbackSuccess';
import CallbackError from '../components/callback/CallbackError';

type CallbackPhase = 'verifying' | 'success' | 'error';

export default function Callback() {
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
          setErrorMessage('Aucune session trouvée. Veuillez réessayer.');
          return;
        }

        const accessToken = await getAccessToken();

        if (accessToken) {
          setTokens(accessToken, '');
          setUser({
            id: user.id || user.user_id,
            email: user.email,
            username: user.email.split('@')[0],
            onboarding: false,
          });
        }

        setPhase('success');

        setTimeout(() => {
          navigate('/onboarding', { replace: true });
        }, 1800);
      } catch (err) {
        setPhase('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Échec de la vérification. Veuillez réessayer.",
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
          Authentification sécurisée via Reddish
        </p>
      </div>
    </div>
  );
}

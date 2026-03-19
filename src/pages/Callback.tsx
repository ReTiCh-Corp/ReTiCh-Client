import { MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@retish/auth/react';
import { useAuthStore } from '../stores/useAuthStore';

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
      {/* Background texture — subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-primary-600) 0.8px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft radial glow behind card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary-100) 0%, transparent 70%)',
        }}
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-sm mx-4 animate-callback-card-in">
        <div className="bg-white rounded-3xl shadow-xl shadow-grey-200/60 border border-border-light px-8 py-12 text-center">
          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
              <MessageSquare className="w-4 h-4 text-primary-600" />
            </div>
            <span className="font-display font-bold text-base text-text">
              ReTiCh
            </span>
          </div>

          {/* Phase: Verifying */}
          {phase === 'verifying' && (
            <div className="animate-callback-fade-in">
              {/* Spinner ring */}
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-[3px] border-grey-100" />
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary-500 animate-spin" />
                <div
                  className="absolute inset-[6px] rounded-full opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle, var(--color-primary-50) 0%, transparent 70%)',
                  }}
                />
              </div>

              <h1 className="font-display font-bold text-xl text-text mb-2">
                Vérification en cours
              </h1>
              <p className="text-sm text-text-muted leading-relaxed">
                Validation de votre connexion via Reddish…
              </p>

              {/* Shimmer progress bar */}
              <div className="mt-8 h-1 rounded-full bg-grey-100 overflow-hidden">
                <div
                  className="h-full w-2/3 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--color-primary-200), var(--color-primary-500), var(--color-primary-200))',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          )}

          {/* Phase: Success */}
          {phase === 'success' && (
            <div className="animate-callback-fade-in">
              {/* Animated check circle */}
              <div className="relative w-20 h-20 mx-auto mb-8">
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full bg-leaf-100 animate-callback-pulse-1" />
                <div className="absolute inset-0 rounded-full bg-leaf-50 animate-callback-pulse-2" />

                {/* Check circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 52 52"
                    className="w-16 h-16"
                    aria-hidden="true"
                  >
                    <circle
                      cx="26"
                      cy="26"
                      r="24"
                      fill="none"
                      stroke="var(--color-leaf-500)"
                      strokeWidth="2.5"
                      className="animate-callback-circle-draw"
                      style={{
                        strokeDasharray: 151,
                        strokeDashoffset: 151,
                        strokeLinecap: 'round',
                      }}
                    />
                    <path
                      d="M15 27l7 7 15-15"
                      fill="none"
                      stroke="var(--color-leaf-600)"
                      strokeWidth="3"
                      className="animate-callback-check-draw"
                      style={{
                        strokeDasharray: 36,
                        strokeDashoffset: 36,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                      }}
                    />
                  </svg>
                </div>
              </div>

              <h1 className="font-display font-bold text-xl text-text mb-2">
                Connexion validée
              </h1>
              <p className="text-sm text-text-muted leading-relaxed">
                Votre identité a été confirmée par Reddish.
                <br />
                Redirection en cours…
              </p>

              {/* Completed progress bar */}
              <div className="mt-8 h-1 rounded-full bg-grey-100 overflow-hidden">
                <div className="h-full rounded-full bg-leaf-500 animate-callback-bar-fill" />
              </div>
            </div>
          )}

          {/* Phase: Error */}
          {phase === 'error' && (
            <div className="animate-callback-fade-in">
              {/* Error icon */}
              <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-50" />
                <svg
                  viewBox="0 0 52 52"
                  className="relative w-14 h-14"
                  aria-hidden="true"
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    className="animate-callback-circle-draw"
                    style={{
                      strokeDasharray: 151,
                      strokeDashoffset: 151,
                      strokeLinecap: 'round',
                    }}
                  />
                  <path
                    d="M18 18l16 16M34 18l-16 16"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                    className="animate-callback-check-draw"
                    style={{
                      strokeDasharray: 45,
                      strokeDashoffset: 45,
                      strokeLinecap: 'round',
                    }}
                  />
                </svg>
              </div>

              <h1 className="font-display font-bold text-xl text-text mb-2">
                Échec de la connexion
              </h1>
              <p className="text-sm text-text-muted leading-relaxed mb-8">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>

        {/* Subtle footer */}
        <p className="text-center text-xs text-text-light mt-6">
          Authentification sécurisée via Reddish
        </p>
      </div>
    </div>
  );
}

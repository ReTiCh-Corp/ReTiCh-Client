import { LogIn, MessageSquare, Shield } from 'lucide-react';
import { useState } from 'react';
import AuthBrandPanel from '../components/auth/AuthBrandPanel';
import { useAuth } from "@retish/auth/react"

export default function Login() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Une erreur est survenue.',
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-white">
      <AuthBrandPanel />

      <div className="flex-1 flex flex-col px-6 pt-10 pb-8 md:px-12 lg:px-20 md:justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile brand header */}
          <div className="flex items-center gap-2.5 mb-10 md:mb-16">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50">
              <MessageSquare className="w-4.5 h-4.5 text-primary-600" />
            </div>
            <span className="font-display font-bold text-lg text-text">
              ReTiCh
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="font-display font-bold text-3xl text-text leading-tight">
              Bienvenue sur ReTiCh
            </h1>
            <p className="text-sm text-text-muted mt-2 leading-relaxed">
              Connectez-vous via Reddish pour accéder à vos conversations en
              temps réel.
            </p>
          </div>

          {/* SSO Card */}
          <div className="rounded-2xl border border-border-light bg-grey-50/50 p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100/60 shrink-0">
                <Shield className="w-5 h-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">
                  Authentification centralisée
                </p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Votre compte est géré par Reddish. Cliquez ci-dessous pour
                  vous connecter ou créer un compte.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="group w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirection…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  Se connecter avec Reddish
                </span>
              )}
            </button>
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-text-light mt-8">
            Pas encore de compte ? Il sera créé automatiquement lors de votre
            première connexion via Reddish.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CallbackSuccess() {
  return (
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
  );
}

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-muted tracking-wide uppercase">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-xs font-bold text-primary-500">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-grey-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer effect on active bar */}
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-30 transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}

import OnboardingProgress from '../components/onboarding/OnboardingProgress';
import StepGender from '../components/onboarding/StepGender';
import StepName from '../components/onboarding/StepName';
import StepPhone from '../components/onboarding/StepPhone';
import StepProfilePicture from '../components/onboarding/StepProfilePicture';
import StepStatus from '../components/onboarding/StepStatus';
import StepUsername from '../components/onboarding/StepUsername';
import { useOnboardingStepper } from '../hooks/useOnboardingStepper';

export default function Onboarding() {
  const { currentStep, totalSteps, isSubmitting, error, goNext, finish } =
    useOnboardingStepper();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepName onNext={goNext} />;
      case 2:
        return <StepGender onNext={goNext} />;
      case 3:
        return <StepUsername onNext={goNext} />;
      case 4:
        return <StepPhone onNext={goNext} onSkip={goNext} />;
      case 5:
        return <StepProfilePicture onNext={goNext} onSkip={goNext} />;
      case 6:
        return (
          <StepStatus
            onNext={finish}
            onSkip={finish}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white px-6 pt-6 pb-8">
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div
        key={currentStep}
        className="flex flex-col flex-1 animate-slide-in-right"
      >
        {renderStep()}
      </div>
    </div>
  );
}

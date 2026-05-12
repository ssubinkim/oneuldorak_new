import './OnboardingIntroActions.css'

type OnboardingIntroActionsProps = {
  onSkip: () => void
  onStart: () => void
}

function OnboardingIntroActions({ onSkip, onStart }: OnboardingIntroActionsProps) {
  return (
    <div className="onboarding-intro-actions">
      <button
        className="onboarding-intro-actions__button onboarding-intro-actions__button--secondary"
        type="button"
        onClick={onSkip}
      >
        건너뛰기
      </button>
      <button
        className="onboarding-intro-actions__button onboarding-intro-actions__button--primary"
        type="button"
        onClick={onStart}
      >
        시작하기
      </button>
    </div>
  )
}

export default OnboardingIntroActions

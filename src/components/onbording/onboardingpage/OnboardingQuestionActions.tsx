import './OnboardingQuestionActions.css'

type OnboardingQuestionActionsProps = {
  disabled: boolean
  isFixed?: boolean
  nextLabel: string
  onNext: () => void
  onPrevious: () => void
}

function OnboardingQuestionActions({ disabled, isFixed = false, nextLabel, onNext, onPrevious }: OnboardingQuestionActionsProps) {
  return (
    <div className={`onboarding-question__actions${isFixed ? ' onboarding-question__actions--fixed' : ''}`}>
      <button className="onboarding-question__button onboarding-question__button--secondary" type="button" onClick={onPrevious}>
        이전
      </button>
      <button className="onboarding-question__button onboarding-question__button--primary" type="button" onClick={onNext} disabled={disabled}>
        {nextLabel}
      </button>
    </div>
  )
}

export default OnboardingQuestionActions

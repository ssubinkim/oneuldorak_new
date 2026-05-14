import './OnboardingQuestionActions.css'

type OnboardingQuestionActionsProps = {
  disabled: boolean
  isIngredientsQuestion?: boolean
  isFixed?: boolean
  nextLabel: string
  onNext: () => void
  onPrevious: () => void
}

function OnboardingQuestionActions({
  disabled,
  isIngredientsQuestion = false,
  isFixed = false,
  nextLabel,
  onNext,
  onPrevious,
}: OnboardingQuestionActionsProps) {
  return (
    <div
      className={`onboarding-question__actions${isFixed ? ' onboarding-question__actions--fixed' : ''}${isIngredientsQuestion ? ' onboarding-question__actions--ingredients' : ''}`}
    >
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

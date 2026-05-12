import type { AnswerValue, OptionLayout } from './onboardingQuestionTypes'
import './OnboardingOptionList.css'

type OnboardingOptionListProps = {
  onSelect: (option: string) => void
  optionLayout: OptionLayout
  options: string[]
  selectedAnswer?: AnswerValue
}

function OnboardingOptionList({ onSelect, optionLayout, options, selectedAnswer }: OnboardingOptionListProps) {
  return (
    <div className={`onboarding-question__options onboarding-question__options--${optionLayout}`}>
      {options.map((option) => {
        const isSelected = Array.isArray(selectedAnswer) ? selectedAnswer.includes(option) : selectedAnswer === option

        return (
          <button
            className={`onboarding-question__option${isSelected ? ' onboarding-question__option--selected' : ''}`}
            type="button"
            onClick={() => onSelect(option)}
            key={option}
          >
            <span>{option}</span>
            <span className="onboarding-question__option-indicator" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

export default OnboardingOptionList

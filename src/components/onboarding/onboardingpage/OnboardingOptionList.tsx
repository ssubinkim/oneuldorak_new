import { useState } from 'react'
import type { AnswerValue, OptionLayout } from './onboardingQuestionTypes'
import OnboardingCustomInputModal from './OnboardingCustomInputModal'
import './OnboardingOptionList.css'

type OnboardingOptionListProps = {
  customOptionLabel?: string
  onSelect: (option: string) => void
  optionLayout: OptionLayout
  options: string[]
  selectedAnswer?: AnswerValue
}

function OnboardingOptionList({
  customOptionLabel = '기타',
  onSelect,
  optionLayout,
  options,
  selectedAnswer,
}: OnboardingOptionListProps) {
  const [customText, setCustomText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draftText, setDraftText] = useState('')

  const isCustomOptionActive = Array.isArray(selectedAnswer)
    ? selectedAnswer.some((v) => v === customOptionLabel || (customText !== '' && v === customText))
    : selectedAnswer === customOptionLabel || (customText !== '' && selectedAnswer === customText)

  const handleOptionClick = (option: string) => {
    if (option === customOptionLabel) {
      if (isCustomOptionActive) {
        const valueToRemove = customText || customOptionLabel
        onSelect(valueToRemove)
        setCustomText('')
      } else {
        onSelect(customOptionLabel)
        setDraftText(customText)
        setIsModalOpen(true)
      }
    } else {
      onSelect(option)
    }
  }

  const handleModalConfirm = () => {
    const prevValue = customText || customOptionLabel
    const nextValue = draftText || customOptionLabel

    if (prevValue !== nextValue) {
      onSelect(prevValue)
      onSelect(nextValue)
    }
    setCustomText(draftText)
    setIsModalOpen(false)
  }

  const handleModalClose = () => {
    setDraftText(customText)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className={`onboarding-question__options onboarding-question__options--${optionLayout}`}>
        {options.map((option) => {
          const isSelected =
            option === customOptionLabel
              ? isCustomOptionActive
              : Array.isArray(selectedAnswer)
                ? selectedAnswer.includes(option)
                : selectedAnswer === option

          return (
            <button
              className={`onboarding-question__option${isSelected ? ' onboarding-question__option--selected' : ''}`}
              type="button"
              onClick={() => handleOptionClick(option)}
              key={option}
            >
              <span>{option === customOptionLabel && customText ? customText : option}</span>
              <span className="onboarding-question__option-indicator" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      {isModalOpen && (
        <OnboardingCustomInputModal
          draftText={draftText}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          onDraftChange={setDraftText}
        />
      )}
    </>
  )
}

export default OnboardingOptionList

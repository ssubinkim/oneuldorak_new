import { useEffect, useRef, useState } from 'react'
import type { AnswerValue, IngredientOption } from './onboardingQuestionTypes'
import OnboardingCustomInputModal from './OnboardingCustomInputModal'
import './OnboardingIngredientGrid.css'

const CUSTOM_LABEL = '기타'

type OnboardingIngredientGridProps = {
  ingredients: IngredientOption[]
  onSelect: (option: string) => void
  selectedAnswer?: AnswerValue
}

function OnboardingIngredientGrid({ ingredients, onSelect, selectedAnswer }: OnboardingIngredientGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showBlur, setShowBlur] = useState(false)
  const [customText, setCustomText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draftText, setDraftText] = useState('')

  useEffect(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement) return

    const updateBlurVisibility = () => {
      const remainingScroll = scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop
      const canScroll = scrollElement.scrollHeight > scrollElement.clientHeight + 1
      setShowBlur(canScroll && remainingScroll > 1)
    }

    updateBlurVisibility()
    scrollElement.addEventListener('scroll', updateBlurVisibility, { passive: true })
    window.addEventListener('resize', updateBlurVisibility)

    return () => {
      scrollElement.removeEventListener('scroll', updateBlurVisibility)
      window.removeEventListener('resize', updateBlurVisibility)
    }
  }, [ingredients.length])

  const isCustomActive = Array.isArray(selectedAnswer)
    ? selectedAnswer.some((v) => v === CUSTOM_LABEL || (customText !== '' && v === customText))
    : false

  const handleIngredientClick = (label: string) => {
    if (label === CUSTOM_LABEL) {
      if (isCustomActive) {
        const valueToRemove = customText || CUSTOM_LABEL
        onSelect(valueToRemove)
        setCustomText('')
      } else {
        onSelect(CUSTOM_LABEL)
        setDraftText(customText)
        setIsModalOpen(true)
      }
    } else {
      onSelect(label)
    }
  }

  const handleModalConfirm = () => {
    const prevValue = customText || CUSTOM_LABEL
    const nextValue = draftText || CUSTOM_LABEL

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
      <div className="onboarding-ingredient-scroll">
        <div className="onboarding-ingredient-grid" ref={scrollRef}>
          {ingredients.map((ingredient) => {
            const isSelected =
              ingredient.label === CUSTOM_LABEL
                ? isCustomActive
                : Array.isArray(selectedAnswer)
                  ? selectedAnswer.includes(ingredient.label)
                  : selectedAnswer === ingredient.label

            return (
              <button
                className={`onboarding-ingredient-card${isSelected ? ' onboarding-ingredient-card--selected' : ''}`}
                type="button"
                onClick={() => handleIngredientClick(ingredient.label)}
                data-label={ingredient.label}
                key={ingredient.label}
              >
                {ingredient.icon ? <img src={ingredient.icon} alt="" /> : <span className="onboarding-ingredient-card__spacer" />}
                <span>{ingredient.label === CUSTOM_LABEL && customText ? customText : ingredient.label}</span>
              </button>
            )
          })}
        </div>
        <div
          className={`onboarding-ingredient-scroll__blur${showBlur ? ' onboarding-ingredient-scroll__blur--visible' : ''}`}
          aria-hidden="true"
        />
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

export default OnboardingIngredientGrid

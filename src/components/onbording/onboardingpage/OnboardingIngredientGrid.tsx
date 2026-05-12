import { useEffect, useRef, useState } from 'react'
import type { AnswerValue, IngredientOption } from './onboardingQuestionTypes'
import './OnboardingIngredientGrid.css'

type OnboardingIngredientGridProps = {
  ingredients: IngredientOption[]
  onSelect: (option: string) => void
  selectedAnswer?: AnswerValue
}

function OnboardingIngredientGrid({ ingredients, onSelect, selectedAnswer }: OnboardingIngredientGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showBlur, setShowBlur] = useState(false)

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

  return (
    <div className="onboarding-ingredient-scroll">
      <div className="onboarding-ingredient-grid" ref={scrollRef}>
        {ingredients.map((ingredient) => {
          const isSelected = Array.isArray(selectedAnswer) ? selectedAnswer.includes(ingredient.label) : selectedAnswer === ingredient.label

          return (
            <button
              className={`onboarding-ingredient-card${isSelected ? ' onboarding-ingredient-card--selected' : ''}`}
              type="button"
              onClick={() => onSelect(ingredient.label)}
              key={ingredient.label}
            >
              {ingredient.icon ? <img src={ingredient.icon} alt="" /> : <span className="onboarding-ingredient-card__spacer" />}
              <span>{ingredient.label}</span>
            </button>
          )
        })}
      </div>
      <div
        className={`onboarding-ingredient-scroll__blur${showBlur ? ' onboarding-ingredient-scroll__blur--visible' : ''}`}
        aria-hidden="true"
      />
    </div>
  )
}

export default OnboardingIngredientGrid

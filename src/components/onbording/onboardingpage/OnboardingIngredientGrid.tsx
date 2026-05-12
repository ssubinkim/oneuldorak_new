import type { AnswerValue, IngredientOption } from './onboardingQuestionTypes'
import './OnboardingIngredientGrid.css'

type OnboardingIngredientGridProps = {
  ingredients: IngredientOption[]
  onSelect: (option: string) => void
  selectedAnswer?: AnswerValue
}

function OnboardingIngredientGrid({ ingredients, onSelect, selectedAnswer }: OnboardingIngredientGridProps) {
  return (
    <div className="onboarding-ingredient-grid">
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
  )
}

export default OnboardingIngredientGrid

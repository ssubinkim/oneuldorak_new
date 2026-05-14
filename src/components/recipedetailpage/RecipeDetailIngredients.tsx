import type { Ingredient } from './recipeDetailData'
import { StatIcon } from './RecipeDetailIcons'

type RecipeDetailIngredientsProps = {
  ingredients: Ingredient[]
  checkedIngredientIds?: string[]
  onToggleIngredient?: (ingredientId: string) => void
  onShoppingChecklistClick?: () => void
}

function RecipeDetailIngredients({
  ingredients,
  checkedIngredientIds = [],
  onToggleIngredient,
  onShoppingChecklistClick,
}: RecipeDetailIngredientsProps) {
  const checkedCount = checkedIngredientIds.length

  return (
    <section className="recipe-detail-section">
      <h2>재료</h2>
      <ul className="recipe-detail-ingredients">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className={checkedIngredientIds.includes(ingredient.id) ? 'is-checked' : ''}>
            <span className="recipe-detail-ingredient-name">
              <img src={ingredient.icon} alt="" aria-hidden="true" />
              {ingredient.name} {ingredient.quantity}
            </span>
            <button
              type="button"
              aria-label={`${ingredient.name} 장보기 체크`}
              className={checkedIngredientIds.includes(ingredient.id) ? 'is-checked' : ''}
              onClick={() => onToggleIngredient?.(ingredient.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6.3 12.3 3.5 3.5 7.9-8" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {onShoppingChecklistClick ? (
        <button type="button" className="recipe-detail-cart-button" onClick={onShoppingChecklistClick}>
          <StatIcon type="basket" />
          장보기 체크리스트 담기 ({checkedCount}/{ingredients.length})
        </button>
      ) : null}
    </section>
  )
}

export default RecipeDetailIngredients

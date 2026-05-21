import { useState } from 'react'
import type { ReactNode } from 'react'
import RecipeDetailShoppingSheet from './RecipeDetailShoppingSheet'
import type { Ingredient, IngredientStatus } from './recipeDetailData'

type RecipeDetailIngredientsProps = {
  ingredients: Ingredient[]
}

const statusConfig: Record<IngredientStatus, { label: string; modifier: string; icon: ReactNode }> = {
  owned: {
    label: '보유중',
    modifier: 'owned',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
  },
  low: {
    label: '부족',
    modifier: 'low',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  none: {
    label: '없음',
    modifier: 'none',
    icon: null,
  },
}

function RecipeDetailIngredients({ ingredients }: RecipeDetailIngredientsProps) {
  const [cartItemIds, setCartItemIds] = useState<Set<string>>(new Set())
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleToggleCart = (id: string) => {
    setCartItemIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const statusOrder: Record<string, number> = { owned: 0, low: 1, none: 2 }
  const sortedIngredients = [...ingredients].sort(
    (a, b) => (statusOrder[a.status ?? 'none'] ?? 2) - (statusOrder[b.status ?? 'none'] ?? 2)
  )

  const noneIngredients = ingredients.filter((i) => (i.status ?? 'none') === 'none')
  const cartItems = noneIngredients
    .filter((i) => cartItemIds.has(i.id))
    .map((i) => ({ id: i.id, name: i.name, icon: i.icon }))

  return (
    <section className="recipe-detail-section">
      <h2>재료</h2>
      <div className="recipe-detail-ingredient-legend">
        <span className="recipe-detail-ingredient-legend__dot recipe-detail-ingredient-legend__dot--owned" />
        보유 중
        <span className="recipe-detail-ingredient-legend__dot recipe-detail-ingredient-legend__dot--low" />
        부족
        <span className="recipe-detail-ingredient-legend__dot recipe-detail-ingredient-legend__dot--none" />
        없음
      </div>
      <ul className="recipe-detail-ingredients">
        {sortedIngredients.map((ingredient) => {
          const status = ingredient.status ?? 'none'
          const config = statusConfig[status]
          const isCartChecked = cartItemIds.has(ingredient.id)

          if (status === 'none') {
            return (
              <li
                key={ingredient.id}
                className={`recipe-detail-ingredient-card recipe-detail-ingredient-card--none${isCartChecked ? ' is-cart-checked' : ''}`}
              >
                <button
                  type="button"
                  className={`recipe-detail-ingredient-checkbox${isCartChecked ? ' is-checked' : ''}`}
                  aria-pressed={isCartChecked}
                  aria-label={`${ingredient.name} 장보기 추가`}
                  onClick={() => handleToggleCart(ingredient.id)}
                >
                  {isCartChecked && (
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className="recipe-detail-ingredient-card__name">{ingredient.name}</span>
                <span className="recipe-detail-ingredient-card__quantity">{ingredient.quantity}</span>
              </li>
            )
          }

          return (
            <li key={ingredient.id} className={`recipe-detail-ingredient-card recipe-detail-ingredient-card--${config.modifier}`}>
              <span className="recipe-detail-ingredient-card__icon">{config.icon}</span>
              <span className="recipe-detail-ingredient-card__name">{ingredient.name}</span>
              <span className="recipe-detail-ingredient-card__quantity">{ingredient.quantity}</span>
            </li>
          )
        })}
      </ul>

      <button type="button" className="recipe-detail-cart-button" onClick={() => setIsSheetOpen(true)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.4 5.3h2.1l1.8 9.1a1.8 1.8 0 0 0 1.8 1.5h6.7a1.8 1.8 0 0 0 1.7-1.3l1.2-5.4H7.3" />
          <circle cx="10.4" cy="19.3" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="17.2" cy="19.3" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        장보기 체크리스트 담기 ({cartItemIds.size}/{noneIngredients.length})
      </button>

      <RecipeDetailShoppingSheet
        isOpen={isSheetOpen}
        items={cartItems}
        onClose={() => setIsSheetOpen(false)}
      />
    </section>
  )
}

export default RecipeDetailIngredients

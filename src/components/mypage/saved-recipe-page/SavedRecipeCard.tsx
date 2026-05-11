import './SavedRecipeCard.css'

export type SavedRecipe = {
  id: number
  showIcon: boolean
  title: string
  savedAt: string
}

type Props = { recipe: SavedRecipe }

export default function SavedRecipeCard({ recipe }: Props) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-top">
        <div className="recipe-card-left">
          <span className="recipe-card-badge">레시피</span>
          {recipe.showIcon && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polyline points="1,11 5,7 9,9 15,3" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="11,3 15,3 15,7" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <button className="recipe-card-bookmark" aria-label="저장 취소">
          <svg width="18" height="22" viewBox="0 0 18 22" fill="#ef5246">
            <path d="M1 1H17V20L9 15L1 20V1Z" />
          </svg>
        </button>
      </div>
      <div className="recipe-card-title">{recipe.title}</div>
      <div className="recipe-card-date">{recipe.savedAt}</div>
    </div>
  )
}

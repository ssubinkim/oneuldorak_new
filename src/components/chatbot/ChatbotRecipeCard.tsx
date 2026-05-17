import type { RecipeData } from '../../types/chatbot'
import './ChatbotRecipeCard.css'

type ChatbotRecipeCardProps = {
  recipe: RecipeData
}

function ChatbotRecipeCard({ recipe }: ChatbotRecipeCardProps) {
  return (
    <div className="chatbot-recipe-card">
      <div className="chatbot-recipe-card__header">
        <p className="chatbot-recipe-card__title">{recipe.title}</p>
        <p className="chatbot-recipe-card__subtitle">{recipe.subtitle}</p>
      </div>

      <div className="chatbot-recipe-card__body">
        {recipe.imageUrl ? (
          <img className="chatbot-recipe-card__image" src={recipe.imageUrl} alt={recipe.title} />
        ) : (
          <div className="chatbot-recipe-card__image-placeholder" />
        )}
        <div className="chatbot-recipe-card__stats">
          <div className="chatbot-recipe-card__stat">
            <span className="chatbot-recipe-card__stat-label">조리시간</span>
            <span className="chatbot-recipe-card__stat-value">{recipe.cookTime}</span>
          </div>
          <div className="chatbot-recipe-card__stat">
            <span className="chatbot-recipe-card__stat-label">예상식비</span>
            <span className="chatbot-recipe-card__stat-value">{recipe.estimatedCost}</span>
          </div>
        </div>
      </div>

      <div className="chatbot-recipe-card__divider" />

      <div className="chatbot-recipe-card__reason">
        <p className="chatbot-recipe-card__reason-title">✦ 추천 이유</p>
        <p className="chatbot-recipe-card__reason-text">{recipe.reason}</p>
      </div>
    </div>
  )
}

export default ChatbotRecipeCard

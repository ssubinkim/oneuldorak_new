import type { RecipeData } from '../../types/chatbot'
import './ChatbotRecipeCard.css'

type ChatbotRecipeCardProps = {
  recipe: RecipeData
}

type ReasonHighlight = {
  label: string
  value: string
}

const REASON_HIGHLIGHT_LABELS = [
  '활용 재료',
  '추가 재료',
  '절약 포인트',
  '조리법',
  '조리 방법',
  '만드는 법',
]

function normalizeLabel(value: string) {
  return value.replace(/\s+/g, '')
}

function getIngredientChips(subtitle: string) {
  const cleaned = subtitle
    .replace(/활용\s*메뉴/g, '')
    .replace(/추천\s*메뉴/g, '')
    .trim()

  if (!cleaned.includes(',')) {
    return []
  }

  return cleaned
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4)
}

function getReasonDisplay(reason: string) {
  const highlights: ReasonHighlight[] = []
  const bodyLines: string[] = []

  reason.split('\n').forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line) return

    const match = line.match(/^(.{2,18}?)\s*[:：]\s*(.+)$/)
    if (match) {
      const label = match[1].trim()
      const value = match[2].trim()
      const normalized = normalizeLabel(label)
      const isHighlight = REASON_HIGHLIGHT_LABELS.some((candidate) =>
        normalized.includes(normalizeLabel(candidate)),
      )

      if (isHighlight && value) {
        highlights.push({ label, value })
        return
      }
    }

    bodyLines.push(line)
  })

  return {
    highlights,
    body: bodyLines.join('\n'),
  }
}

function ChatbotRecipeCard({ recipe }: ChatbotRecipeCardProps) {
  const ingredientChips = getIngredientChips(recipe.subtitle)
  const reasonDisplay = getReasonDisplay(recipe.reason)

  return (
    <article className="chatbot-recipe-card" aria-label={`${recipe.title} 추천 카드`}>
      <div className="chatbot-recipe-card__header">
        <span className="chatbot-recipe-card__eyebrow">추천 도시락</span>
        <p className="chatbot-recipe-card__title">{recipe.title}</p>
        {ingredientChips.length > 0 ? (
          <div className="chatbot-recipe-card__ingredients" aria-label="활용 재료">
            <span className="chatbot-recipe-card__ingredients-label">활용 재료</span>
            <div className="chatbot-recipe-card__ingredient-list">
              {ingredientChips.map((ingredient) => (
                <span className="chatbot-recipe-card__ingredient-chip" key={ingredient}>
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="chatbot-recipe-card__subtitle">{recipe.subtitle}</p>
        )}
      </div>

      <div className="chatbot-recipe-card__image-wrap">
        {recipe.imageUrl ? (
          <img className="chatbot-recipe-card__image" src={recipe.imageUrl} alt={recipe.title} />
        ) : (
          <div className="chatbot-recipe-card__image-placeholder" />
        )}
      </div>

      <div className="chatbot-recipe-card__stats" aria-label="조리 정보">
        <div className="chatbot-recipe-card__stat">
          <span className="chatbot-recipe-card__stat-label">조리시간</span>
          <span className="chatbot-recipe-card__stat-value">{recipe.cookTime}</span>
        </div>
        <div className="chatbot-recipe-card__stat">
          <span className="chatbot-recipe-card__stat-label">예상식비</span>
          <span className="chatbot-recipe-card__stat-value">{recipe.estimatedCost}</span>
        </div>
      </div>

      <div className="chatbot-recipe-card__reason">
        <div className="chatbot-recipe-card__reason-heading">
          <span className="chatbot-recipe-card__reason-mark" aria-hidden="true" />
          <p className="chatbot-recipe-card__reason-title">추천 이유</p>
        </div>
        {reasonDisplay.highlights.length > 0 ? (
          <dl className="chatbot-recipe-card__reason-list">
            {reasonDisplay.highlights.map((item) => (
              <div className="chatbot-recipe-card__reason-row" key={`${item.label}-${item.value}`}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {reasonDisplay.body ? (
          <p className="chatbot-recipe-card__reason-text">{reasonDisplay.body}</p>
        ) : null}
      </div>
    </article>
  )
}

export default ChatbotRecipeCard

import type { AiChatResponse } from '../types/ai.types'

type FridgeAnalyzeResultCardProps = {
  response?: AiChatResponse
  ingredients?: string[]
  menus?: string[]
  priority?: string[]
  className?: string
}

function FridgeAnalyzeResultCard({
  response,
  ingredients = [],
  menus = [],
  priority = [],
  className = '',
}: FridgeAnalyzeResultCardProps) {
  return (
    <article className={`fridge-analyze-result-card ${className}`.trim()}>
      <h3>Fridge Analysis</h3>
      {response?.text ? <p>{response.text}</p> : null}
      {ingredients.length > 0 ? <p>Ingredients: {ingredients.join(', ')}</p> : null}
      {menus.length > 0 ? <p>Menus: {menus.join(', ')}</p> : null}
      {priority.length > 0 ? <p>Use first: {priority.join(', ')}</p> : null}
    </article>
  )
}

export default FridgeAnalyzeResultCard

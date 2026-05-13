import type { CookingTool } from './recipeDetailData'

type RecipeDetailToolsProps = {
  tools: CookingTool[]
}

function RecipeDetailTools({ tools }: RecipeDetailToolsProps) {
  return (
    <section className="recipe-detail-section">
      <h2>조리도구</h2>
      <div className="recipe-detail-tool-list">
        {tools.map((tool) => (
          <span key={tool.id}>{tool.label}</span>
        ))}
      </div>
    </section>
  )
}

export default RecipeDetailTools

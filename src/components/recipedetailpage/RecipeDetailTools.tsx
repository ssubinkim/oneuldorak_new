type RecipeDetailToolsProps = {
  tools: string[]
}

function RecipeDetailTools({ tools }: RecipeDetailToolsProps) {
  return (
    <section className="recipe-detail-section">
      <h2>조리도구</h2>
      <div className="recipe-detail-tool-list">
        {tools.map((tool) => (
          <span key={tool}>{tool}</span>
        ))}
      </div>
    </section>
  )
}

export default RecipeDetailTools

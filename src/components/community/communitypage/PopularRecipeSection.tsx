import './PopularRecipeSection.css'

export type RecipeCard = {
  id: string
  icon: string
  channel: string
  title: string
  likes: number
  image: string
}

type PopularRecipeSectionProps = {
  recipes: RecipeCard[]
}

function PopularRecipeSection({ recipes }: PopularRecipeSectionProps) {
  return (
    <section className="recipe-section">
      <div className="recipe-section__header">
        <h2>인기 레시피</h2>
        <button type="button" className="recipe-section__more">
          더보기
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="recipe-section__scroll">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="popular-recipe-card">
            <img className="popular-recipe-card__image" src={recipe.image} alt={recipe.title} />
            <div className="popular-recipe-card__overlay">
              <div className="popular-recipe-card__meta">
                <span>{recipe.icon}</span>
                <span>{recipe.channel}</span>
              </div>
              <div className="popular-recipe-card__title-row">
                <h3 className="popular-recipe-card__title">{recipe.title}</h3>
                <span className="popular-recipe-card__likes">♡ {recipe.likes}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PopularRecipeSection

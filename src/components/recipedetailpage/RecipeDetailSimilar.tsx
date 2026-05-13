import type { SimilarRecipe } from './recipeDetailData'
import { StatIcon } from './RecipeDetailIcons'

type RecipeDetailSimilarProps = {
  recipes: SimilarRecipe[]
}

function RecipeDetailSimilar({ recipes }: RecipeDetailSimilarProps) {
  return (
    <section className="recipe-detail-section recipe-detail-similar">
      <h2>비슷한 레시피</h2>
      <div className="recipe-detail-similar__scroll">
        {recipes.map((recipe) => (
          <article className="recipe-detail-similar-card" key={recipe.title}>
            <img src={recipe.image} alt={recipe.title} />
            <div>
              <small>{recipe.channel}</small>
              <h3>{recipe.title}</h3>
              <span>
                <StatIcon type="heart" />
                {recipe.likes}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecipeDetailSimilar

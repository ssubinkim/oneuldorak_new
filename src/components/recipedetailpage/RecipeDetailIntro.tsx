import type { RecipeDetail } from './recipeDetailData'
import { DifficultyStars, StatIcon } from './RecipeDetailIcons'

type RecipeDetailIntroProps = {
  recipe: RecipeDetail
}

function RecipeDetailIntro({ recipe }: RecipeDetailIntroProps) {
  return (
    <section className="recipe-detail-section recipe-detail-intro">
      <h1>{recipe.title}</h1>

      <div className="recipe-detail-reactions" aria-label="레시피 반응">
        <span className="is-heart">
          <StatIcon type="heart" />
          {recipe.likes}
        </span>
        <span>
          <StatIcon type="comment" />
          {recipe.comments}
        </span>
        <span>
          <StatIcon type="bookmark" />
          {recipe.saves}
        </span>
      </div>

      <p className="recipe-detail-note">
        {recipe.author} · {recipe.date}
        <span>{recipe.description}</span>
      </p>

      <div className="recipe-detail-info-grid">
        <article>
          <span>조리시간</span>
          <strong>{recipe.time}</strong>
        </article>
        <article>
          <span>예상식비</span>
          <strong>{recipe.budget}</strong>
        </article>
        <article>
          <span>난이도</span>
          <DifficultyStars level={recipe.level} />
        </article>
      </div>
    </section>
  )
}

export default RecipeDetailIntro

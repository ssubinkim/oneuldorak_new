import type { RecipeDetail } from './recipeDetailData'
import { DifficultyStars, StatIcon } from './RecipeDetailIcons'

type RecipeDetailIntroProps = {
  recipe: RecipeDetail
  isLiked?: boolean
  isSaved?: boolean
  onLikeClick?: () => void
  onSaveClick?: () => void
}

function RecipeDetailIntro({
  recipe,
  isLiked = false,
  isSaved = false,
  onLikeClick,
  onSaveClick,
}: RecipeDetailIntroProps) {
  return (
    <section className="recipe-detail-section recipe-detail-intro">
      <h1>{recipe.title}</h1>

      <div className="recipe-detail-reactions" aria-label="레시피 반응">
        <button
          type="button"
          className={`recipe-detail-reaction is-heart${isLiked ? ' is-active' : ''}`}
          aria-pressed={isLiked}
          onClick={onLikeClick}
        >
          <StatIcon type="heart" />
          {recipe.stats.likeCount}
        </button>
        <span className="recipe-detail-reaction">
          <StatIcon type="comment" />
          {recipe.stats.commentCount}
        </span>
        <button
          type="button"
          className={`recipe-detail-reaction is-bookmark${isSaved ? ' is-active' : ''}`}
          aria-pressed={isSaved}
          onClick={onSaveClick}
        >
          <StatIcon type="bookmark" />
          {recipe.stats.saveCount}
        </button>
      </div>

      <p className="recipe-detail-note">
        {recipe.meta.authorName} · {recipe.meta.publishedOn}
        <span>{recipe.summary}</span>
      </p>

      <div className="recipe-detail-info-grid">
        <article>
          <span>조리시간</span>
          <strong>{recipe.cook.durationMinutes}분</strong>
        </article>
        <article>
          <span>예상식비</span>
          <strong>{recipe.cook.budgetLabel}</strong>
        </article>
        <article>
          <span>난이도</span>
          <DifficultyStars level={recipe.cook.difficultyLevel} />
        </article>
      </div>
    </section>
  )
}

export default RecipeDetailIntro

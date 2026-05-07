import { ChevronIcon } from './ChevronIcon'
import './HomeRecipeSection.css'

const recipes = [
  { title: '계란말이' },
  { title: '제육볶음' },
  { title: '두부조림' },
  { title: '닭가슴살 샐러드' },
]

function HomeRecipeSection() {
  return (
    <section className="recipe-section" aria-labelledby="recipeTitle">
      <div className="section-title">
        <h2 id="recipeTitle">이 레시피 어때요?</h2>
        <a href="#more-recipes">
          더보기
          <ChevronIcon />
        </a>
      </div>
      <p className="recipe-section__subtitle">제일 많이 본 인기있는 레시피 모음</p>
      <div className="recipe-scroll">
        {recipes.map((recipe) => (
          <article className="recipe-card" key={recipe.title}>
            <div className="recipe-card__image" aria-hidden="true" />
            <div className="recipe-card__body">
              <h3>{recipe.title}</h3>
              <p>
                <span className="heart">♡</span>36 ·▣13
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeRecipeSection

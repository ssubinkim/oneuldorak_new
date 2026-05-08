import './HomeRecipeSection.css'

const recipes = [
  { title: '샐러드' },
  { title: '떡볶이' },
  { title: '계란말이' },
]

function HomeRecipeSection() {
  return (
    <section className="recipe-section" aria-labelledby="recipeTitle">
      <div className="home-section-title recipe-section__title">
        <div>
          <h2 id="recipeTitle">이 레시피 어때요?</h2>
          <p>제일 많이 본 인기있는 레시피 모음</p>
        </div>
        <a href="#more-recipes">더보기 〉</a>
      </div>
      <div className="recipe-scroll">
        {recipes.map((recipe) => (
          <article className="recipe-card" key={recipe.title}>
            <div className="recipe-card__image" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="recipe-card__body">
              <h3>{recipe.title}</h3>
              <p>
                <span className="heart">♡</span>36 · ◎13
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="home-dots recipe-section__dots" aria-hidden="true">
        <span className="home-dots__item home-dots__item--active" />
        <span className="home-dots__item" />
        <span className="home-dots__item" />
        <span className="home-dots__item" />
        <span className="home-dots__item" />
      </div>
    </section>
  )
}

export default HomeRecipeSection

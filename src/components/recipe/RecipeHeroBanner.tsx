import recipDorak from './images/dorak_recipe.png'
import './RecipeHeroBanner.css'

function RecipeHeroBanner() {
  return (
    <div className="recipe-hero">
      <div className="recipe-hero__header">
        <div className="recipe-hero__text">
          <h1 className="recipe-hero__title">레시피</h1>
          <p className="recipe-hero__subtitle">
            오늘도 바쁜 도락이들의 도시락 이야기
            <br />
            도시락도 ROCK이다!
          </p>
        </div>
        <div className="recipe-hero__actions">
          <button className="recipe-hero__icon-btn" type="button" aria-label="저장한 레시피" onClick={() => { window.location.hash = '#/mypage-likes?tab=recipe&from=recipe' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="recipe-hero__icon-btn" type="button" aria-label="프로필" onClick={() => { window.location.hash = '#/recipe-write' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
      <div className="recipe-hero__mascots" aria-hidden="true">
        <img src={recipDorak} alt="" />
      </div>
    </div>
  )
}

export default RecipeHeroBanner

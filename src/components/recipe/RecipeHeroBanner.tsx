import eggMascot from '../../assets/food_mascot/egg_mascot.svg'
import broMascot from '../../assets/food_mascot/bro_mascot.svg'
import carrotMascot from '../../assets/food_mascot/carrot_mascot.svg'
import blueMascot from '../../assets/food_mascot/blue_mascot.svg'
import strawMascot from '../../assets/food_mascot/straw_mascot.svg'
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
          <button className="recipe-hero__icon-btn" type="button" aria-label="프로필">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="recipe-hero__icon-btn" type="button" aria-label="저장한 레시피">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="recipe-hero__mascots" aria-hidden="true">
        <img src={eggMascot} alt="" />
        <img src={broMascot} alt="" />
        <img src={blueMascot} alt="" />
        <img src={carrotMascot} alt="" />
        <img src={strawMascot} alt="" />
      </div>
    </div>
  )
}

export default RecipeHeroBanner

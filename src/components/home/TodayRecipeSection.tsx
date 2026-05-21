import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import twoRecipesImg from '../../assets/food_mascot/two_recipes.png'
import threeRecipesImg from '../../assets/food_mascot/three_recipes.png'
import bookOpenIcon from '../../assets/icons/book_open.svg'
import './TodayRecipeSection.css'

function TodayRecipeSection() {
  const goRecipe = () => { window.location.hash = '#/community?tab=recipe' }
  const goSaved = () => { window.location.hash = '#/mypage?tab=saved' }

  return (
    <section className="recipe-sec">
      <div className="recipe-sec__header">
        <h2 className="recipe-sec__title">오늘의 도시락 레시피</h2>
        <p className="recipe-sec__sub">도락이들의 인기 레시피를 만나보세요</p>
      </div>

      <div className="recipe-sec__grid">
        {/* 레시피 페이지 링크 카드 */}
        <button className="recipe-page-card" onClick={goRecipe} aria-label="레시피 페이지로 이동">
          <span className="recipe-page-card__label">레시피 페이지</span>
          <img src={twoRecipesImg} alt="" className="recipe-page-card__mascot" aria-hidden="true" />
          <span className="recipe-page-card__arrow" aria-hidden="true">›</span>
        </button>

        {/* 레시피 이미지 카드 */}
        <button className="recipe-img-card" onClick={goRecipe} aria-label="레시피 상세보기">
          <img src={kimchiRiceImage} alt="깍두기 볶음밥" className="recipe-img-card__img" />
          <span className="recipe-img-card__badge">1/7</span>
          <div className="recipe-img-card__overlay">
            <span className="recipe-img-card__name">깍두기 볶음밥</span>
            <span className="recipe-img-card__meta">5000원 | 30분 | 초보</span>
          </div>
        </button>
      </div>

      {/* 내 레시피 보관함 */}
      <button className="saved-recipe" onClick={goSaved} aria-label="내 레시피 보관함 바로가기">
        <div className="saved-recipe__text">
          <div className="saved-recipe__top">
            <img src={bookOpenIcon} alt="" width="18" height="18" aria-hidden="true" />
            <span className="saved-recipe__title">내 레시피 보관함</span>
          </div>
          <span className="saved-recipe__sub">저장한 레시피 보러가기</span>
          <span className="saved-recipe__link">바로가기 &gt;</span>
        </div>
        <div className="saved-recipe__mascots" aria-hidden="true">
          <img src={threeRecipesImg} alt="" className="saved-recipe__mascot" />
        </div>
      </button>
    </section>
  )
}

export default TodayRecipeSection

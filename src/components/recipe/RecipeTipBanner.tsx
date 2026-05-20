import mascot from './images/mascote.svg'
import './RecipeTipBanner.css'

function RecipeTipBanner() {
  return (
    <section className="recipe-tip-banner" aria-label="냉장고 활용 팁">
      <div className="recipe-tip-banner__content">
        <p className="recipe-tip-banner__label">오늘의 냉장고 활용 TIP</p>
        <p className="recipe-tip-banner__text">
          냉장고 속 재료를 먼저 확인하면
          <br />
          장보기 횟수를 줄일 수 있어요 !
        </p>
      </div>
      <img className="recipe-tip-banner__mascot" src={mascot} alt="" aria-hidden="true" />
    </section>
  )
}

export default RecipeTipBanner

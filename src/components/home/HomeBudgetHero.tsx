import mascotImage from '../../pages/home/images/home-chef-logo.png'
import './HomeBudgetHero.css'

function HomeBudgetChart() {
  return (
    <svg className="home-budget__chart" viewBox="0 0 230 100" aria-hidden="true">
      <path d="M0 70 38 42 74 25 108 36 142 85 178 44 230 41 230 100 0 100Z" fill="var(--color-tertiary-100)" />
      <path d="M0 70 38 42 74 25 108 36 142 85 178 44 230 41" fill="none" stroke="#e8ddb8" strokeWidth="1.5" />
    </svg>
  )
}

function HomeBudgetHero() {
  return (
    <section className="home-hero" aria-label="이번주 예상 식비">
      <div className="home-hero__copy">
        <h1>
          도시락러버 님
          <br />
          오늘도 <mark>맛있는 절약</mark>을
          <br />
          시작해보세요
        </h1>
      </div>
      <img className="home-hero__mascot" src={mascotImage} alt="" aria-hidden="true" />

      <div className="home-budget">
        <p className="home-budget__label">이번주 예상 식비</p>
        <div className="home-budget__amount">
          28,500 <span>원</span>
        </div>
        <p className="home-budget__meta">지난 주 대비 3,900원 절약했어요 !</p>
        <HomeBudgetChart />
      </div>
    </section>
  )
}

export default HomeBudgetHero

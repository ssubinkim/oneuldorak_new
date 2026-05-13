import './HomeBudgetHero.css'
import { useUserProfile } from '../common/useUserProfile'
import DoughnutChart from '../effects/charts/DoughnutChart'

function HomeBudgetHero() {
  const { nickname } = useUserProfile()

  return (
    <section className="home-hero font-pretendard" aria-label="이번주 예상 식비">
      <div className="home-hero__greeting">
        <p className="home-hero__name">
          <span className="home-hero__chef" aria-hidden="true" />
          {nickname}님
        </p>
        <h1>오늘도 맛있는 절약을 시작해보세요</h1>
      </div>

      <div className="home-budget-card">
        <div>
          <p className="home-budget-card__label">이번주 예상 식비</p>
          <strong className="home-budget-card__amount">28,500원</strong>
          <p className="home-budget-card__meta">
            지난 주 대비 <b>3,900원</b> 절약했어요!
          </p>
        </div>
        <DoughnutChart value={30} label="예산 사용률 30%" />
      </div>
    </section>
  )
}

export default HomeBudgetHero

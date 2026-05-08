import './HomeBudgetHero.css'
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip)

const budgetChartData = {
  datasets: [
    {
      data: [30, 70],
      backgroundColor: ['#F34840', '#DEDEDE'],
      borderWidth: 0,
      cutout: '62%',
      hoverOffset: 0,
    },
  ],
}

const budgetChartOptions = {
  animation: {
    duration: 1100,
    easing: 'easeOutQuart',
  },
  events: [],
  plugins: {
    tooltip: {
      enabled: false,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
} as const

function HomeBudgetChart() {
  return (
    <div className="home-budget-card__chart" aria-label="예산 사용률 30%">
      <Doughnut data={budgetChartData} options={budgetChartOptions} />
      <span>30%</span>
    </div>
  )
}

function HomeBudgetHero() {
  return (
    <section className="home-hero" aria-label="이번주 예상 식비">
      <div className="home-hero__greeting">
        <p className="home-hero__name">
          <span className="home-hero__chef" aria-hidden="true" />
          도시락러버 님
        </p>
        <h1>오늘도 맛있는 절약을 시작해보세요</h1>
      </div>

      <div className="home-budget-card">
        <div>
          <p className="home-budget-card__label">이번주 예상 식비</p>
          <strong className="home-budget-card__amount">28,500원</strong>
          <p className="home-budget-card__meta">
            지난 주 대비 <b>3,900원</b> 절약했어요 !
          </p>
        </div>
        <HomeBudgetChart />
      </div>
    </section>
  )
}

export default HomeBudgetHero

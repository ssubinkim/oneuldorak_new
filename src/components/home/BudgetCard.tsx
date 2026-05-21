import coinImg from './images/coin.png'
import walletImg from './images/wallet.png'
import './BudgetCard.css'

type Props = {
  current: number
  target: number
  savedAmount: number
}

function BudgetCard({ current, target, savedAmount }: Props) {
  const pct = Math.round((current / target) * 100)

  return (
    <div className="budget-card">
      <div className="budget-card__top">
        <span className="budget-card__label">
          <div className="budget-card__coin-wrap">
            <img src={coinImg} alt="" />
          </div>
          이번주 예산 사용량
        </span>
        <span className="budget-card__pct">{pct}%</span>
      </div>
      <div className="budget-card__bar-track">
        <div className="budget-card__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="budget-card__bottom">
        <div className="budget-card__wallet-wrap">
          <img src={walletImg} alt="" />
        </div>
        <span className="budget-card__saved">
          지금까지 {savedAmount.toLocaleString()}원 절약했어요 !
        </span>
        <svg className="budget-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="#0248FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default BudgetCard

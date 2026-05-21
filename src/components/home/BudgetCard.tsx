import { useState, useEffect, useRef } from 'react'
import coinImg from './images/coin.png'
import walletImg from './images/wallet.png'
import './BudgetCard.css'

type Props = {
  current: number
  target: number
  savedAmount: number
}

function easeOutQuad(t: number) {
  return t * (2 - t)
}

function BudgetCard({ current, target, savedAmount }: Props) {
  const pct = Math.round((current / target) * 100)
  const [animatedPct, setAnimatedPct] = useState(0)
  const [displayPct, setDisplayPct] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(pct), 100)
    return () => clearTimeout(timer)
  }, [pct])

  useEffect(() => {
    const duration = 1200
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplayPct(Math.round(easeOutQuad(progress) * pct))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const delay = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, 100)

    return () => {
      clearTimeout(delay)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [pct])

  return (
    <div className="budget-card">
      <div className="budget-card__top">
        <span className="budget-card__label">
          <span className="budget-card__coin-wrap" aria-hidden="true">
            <img className="budget-card__coin-img" src={coinImg} alt="" width="16" height="16" />
          </span>
          <span className="budget-card__label-text">이번주 예산 사용량</span>
        </span>
        <span className="budget-card__pct">{displayPct}%</span>
      </div>

      <div className="budget-card__bar-track">
        <div className="budget-card__bar-fill" style={{ width: `${animatedPct}%` }} />
      </div>

      <div className="budget-card__bottom" onClick={() => { window.location.hash = '#/mypage' }} style={{ cursor: 'pointer' }}>
        <span className="budget-card__wallet-wrap" aria-hidden="true">
          <img className="budget-card__wallet-img" src={walletImg} alt="" width="32" height="32" />
        </span>
        <span className="budget-card__saved">
          지금까지 <span className="budget-card__saved-amount">{savedAmount.toLocaleString()}원</span> 절약했어요 !
        </span>
        <svg className="budget-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="#0248FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default BudgetCard

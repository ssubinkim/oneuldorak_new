import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './MyPageCard.css'
import './MyPageGoalCard.css'

type SavingsGoal = {
  current: number
  target: number
}

type MyPageGoalCardProps = {
  goal: SavingsGoal
  pct: number
  goalBarPct: number
  onEdit: () => void
}

function MyPageGoalCard({ goal, pct, goalBarPct, onEdit }: MyPageGoalCardProps) {
  const [animPct, setAnimPct] = useState(0)
  const [displayPct, setDisplayPct] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setAnimPct(eased * goalBarPct)
      setDisplayPct(Math.round(eased * pct))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pct, goalBarPct])

  const donutStyle = { '--goal-pct': `${animPct}%` } as CSSProperties & { '--goal-pct': string }

  return (
    <button type="button" className="mypage-goal-card" onClick={onEdit}>
      <span className="mypage-goal-copy">
        <span className="mypage-goal-title">6월 첫째주 절약 목표</span>
        <span className="mypage-goal-amount">
          <strong>{goal.current.toLocaleString()}원</strong>
          <span> / {goal.target.toLocaleString()}원</span>
        </span>
        <span className="mypage-goal-note">
          <span className="mypage-goal-note-icon" aria-hidden="true" />
          한끼 한끼 알뜰하게 절약 중!
        </span>
      </span>

      <span className="mypage-goal-donut" style={donutStyle}>
        <span>{displayPct}%</span>
      </span>
    </button>
  )
}

export default MyPageGoalCard

import type { CSSProperties } from 'react'
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
  const donutStyle = { '--goal-pct': `${goalBarPct}%` } as CSSProperties & { '--goal-pct': string }

  return (
    <button type="button" className="mypage-goal-card" onClick={onEdit}>
      <span className="mypage-goal-copy">
        <span className="mypage-goal-title">이번달 절약 목표</span>
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
        <span>{pct}%</span>
      </span>
    </button>
  )
}

export default MyPageGoalCard

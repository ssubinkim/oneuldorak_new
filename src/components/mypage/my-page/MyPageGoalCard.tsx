import { useEffect, useId, useRef, useState } from 'react'
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
  const reactId = useId()
  const gradientId = `mypageGoalGradient-${reactId.replace(/:/g, '')}`

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

  const safePct = Math.min(Math.max(animPct, 0), 100)
  const strokeOffset = 100 - safePct
  const thumbAngle = (safePct / 100) * Math.PI * 2 - Math.PI / 2
  const thumbX = 60 + Math.cos(thumbAngle) * 45
  const thumbY = 60 + Math.sin(thumbAngle) * 45

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

      <span className="mypage-goal-donut" aria-label={`절약 목표 ${displayPct}% 달성`}>
        <svg className="mypage-goal-donut__svg" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="23" y1="21" x2="98" y2="104" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4E7FFF" />
              <stop offset="0.58" stopColor="#79A0FF" />
              <stop offset="1" stopColor="#A4C4FF" />
            </linearGradient>
          </defs>
          <circle className="mypage-goal-donut__track" cx="60" cy="60" r="45" pathLength="100" />
          <circle
            className="mypage-goal-donut__bar"
            cx="60"
            cy="60"
            r="45"
            pathLength="100"
            stroke={`url(#${gradientId})`}
            style={{ strokeDashoffset: strokeOffset }}
          />
          <circle
            className="mypage-goal-donut__thumb"
            cx={thumbX}
            cy={thumbY}
            r="4.6"
            opacity={safePct > 2 ? 1 : 0}
          />
        </svg>
        <span className="mypage-goal-donut__value">{displayPct}%</span>
      </span>
    </button>
  )
}

export default MyPageGoalCard

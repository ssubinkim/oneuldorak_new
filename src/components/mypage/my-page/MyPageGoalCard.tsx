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
  return (
    <div className="mypage-card">
      <div className="mypage-goal-header">
        <span className="mypage-goal-title">이번달 절약 목표</span>
        <button className="mypage-goal-edit" onClick={onEdit}>
          수정
        </button>
      </div>
      <div className="mypage-goal-amount">
        <strong>현재 지출 {goal.current.toLocaleString()}원</strong>
        <span className="sub-text"> /목표 {goal.target.toLocaleString()}원</span>
      </div>
      <div className="mypage-goal-bar-bg">
        <div className="mypage-goal-bar-fill" style={{ width: `${goalBarPct}%` }} />
      </div>
      <div className="mypage-goal-percent-text">
        목표금액의 {pct}% 소비 하셨어요!
      </div>
    </div>
  )
}

export default MyPageGoalCard

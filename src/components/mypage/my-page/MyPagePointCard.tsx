import AttendanceCircles from './AttendanceCircles'
import type { DayData } from './AttendanceCircles'
import './MyPageCard.css'
import './MyPagePointCard.css'

type MyPagePointCardProps = {
  attendance: DayData[]
  totalPoints: number
  onPointHistoryClick: () => void
}

function MyPagePointCard({
  attendance,
  totalPoints,
  onPointHistoryClick,
}: MyPagePointCardProps) {
  return (
    <div className="mypage-card">
      <div className="mypage-point-header">
        <span className="mypage-point-title">나의 포인트</span>
        <span className="mypage-point-amount">{totalPoints}P</span>
      </div>
      <AttendanceCircles data={attendance} />
      <div className="mypage-point-stamp-info">출석도장 3/7</div>
      <button className="mypage-point-btn" onClick={onPointHistoryClick}>
        포인트 내역
        <svg
          viewBox="0 0 16 16"
          width={14}
          height={14}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 3.5 4 4.5-4 4.5" />
        </svg>
      </button>
    </div>
  )
}

export default MyPagePointCard

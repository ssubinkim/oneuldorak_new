import './MyPageCard.css'
import './MyPagePointCard.css'

type MyPagePointCardProps = {
  totalPoints: number
  onPointHistoryClick: () => void
}

function MyPagePointCard({
  totalPoints,
  onPointHistoryClick,
}: MyPagePointCardProps) {
  return (
    <button type="button" className="mypage-point-card" onClick={onPointHistoryClick}>
      <span className="mypage-point-icon-slot" aria-label="포인트 아이콘 자리" />
      <span className="mypage-point-copy">
        <span className="mypage-point-title">나의 포인트</span>
        <span className="mypage-point-amount">{totalPoints.toLocaleString()} p</span>
        <span className="mypage-point-desc">스토어에서 포인트로 할인받으세요 !</span>
      </span>
      <span className="mypage-card-chevron" aria-hidden="true" />
    </button>
  )
}

export default MyPagePointCard

import bookOpenImg from '../../images/book_open.svg'
import indexGreenImg from '../../images/index_green.svg'
import indexRedImg from '../../images/index_red.svg'
import indexYellowImg from '../../images/index_yellow.svg'
import refrigeImg from '../../images/refrige.svg'

type StorageFridgeStatusCardProps = {
  total: number
  urgentCount: number
  moderateCount: number
  plentyCount: number
  menuCount: number
}

function StorageFridgeStatusCard({
  total,
  urgentCount,
  moderateCount,
  plentyCount,
  menuCount,
}: StorageFridgeStatusCardProps) {
  const stats = [
    { label: '임박 재료', count: urgentCount, tape: indexRedImg, tone: 'urgent' },
    { label: '소진 추천', count: moderateCount, tape: indexYellowImg, tone: 'moderate' },
    { label: '여유 있음', count: plentyCount, tape: indexGreenImg, tone: 'plenty' },
  ] as const

  return (
    <div className="sp-fridge-card">
      <div className="sp-fridge-top">
        <div className="sp-fridge-icon-wrap">
          <img src={refrigeImg} alt="냉장고" className="sp-fridge-icon" />
        </div>
        <div className="sp-fridge-info">
          <p className="sp-fridge-label">내 냉장고 현황</p>
          <p className="sp-fridge-count"><strong>{total}</strong> 개 보관 중</p>
          <p className="sp-fridge-menu">
            <img src={bookOpenImg} alt="" className="sp-fridge-menu-icon" />
            만들 수 있는 메뉴 {menuCount}개
          </p>
        </div>
      </div>

      <div className="sp-fridge-stats">
        {stats.map((stat, index) => (
          <div className="sp-fridge-stat-wrap" key={stat.label}>
            <img src={stat.tape} alt="" className="sp-fridge-index" />
            <div className="sp-fridge-stat">
              <span className="sp-stat-label">{stat.label}</span>
              <span className={`sp-stat-num ${stat.tone}`}><strong>{stat.count}</strong> 개</span>
            </div>
            {index < stats.length - 1 && <div className="sp-fridge-divider" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StorageFridgeStatusCard

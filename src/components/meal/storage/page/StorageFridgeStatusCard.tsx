import bookOpenImg from '../../../../assets/icons/meal_book_open.svg'
import blueStuffOpenImg from '../../../home/images/blue_stuffopen.png'

type StorageFridgeStatusCardProps = {
  total: number
  menuCount: number
}

function StorageFridgeStatusCard({ total, menuCount }: StorageFridgeStatusCardProps) {
  return (
    <div className="sp-fridge-card">
      <div className="sp-fridge-top">
        <div className="sp-fridge-icon-wrap">
          <img src={blueStuffOpenImg} alt="냉장고" className="sp-fridge-icon" />
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

    </div>
  )
}

export default StorageFridgeStatusCard

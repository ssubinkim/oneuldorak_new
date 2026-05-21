import {
  carrotImg, potatoImg, appleImg, onionImg, brocollyImg,
  getIngredientIconClassName,
} from '../meal/mealData'
import mushRoomImg from '../../assets/images/food_icon/mushroom.svg'
import tomatoImg from '../../assets/images/food_icon/tomato.svg'
import fridgeIcon from '../../assets/icons/refrige.svg'
import dorak01 from '../../assets/food_mascot_all/dorak01.svg'
import dorak02 from '../../assets/food_mascot_all/dorak02.svg'
import dorak03 from '../../assets/food_mascot_all/dorak03.svg'
import './FridgeSection.css'

interface FridgeIngredient {
  id: number
  name: string
  image: string
  daysLeft: number | null
}

const FRIDGE_ITEMS: FridgeIngredient[] = [
  { id: 1, name: '당근', image: carrotImg, daysLeft: 1 },
  { id: 2, name: '감자', image: potatoImg, daysLeft: 1 },
  { id: 3, name: '사과', image: appleImg, daysLeft: 1 },
  { id: 4, name: '양파', image: onionImg, daysLeft: 1 },
  { id: 5, name: '양배추', image: brocollyImg, daysLeft: 1 },
  { id: 6, name: '버섯', image: mushRoomImg, daysLeft: 1 },
  { id: 7, name: '방울토마토', image: tomatoImg, daysLeft: 1 },
]

const urgentCount = FRIDGE_ITEMS.filter(i => i.daysLeft !== null).length

function FridgeSection() {
  return (
    <section className="fridge-sec">
      <div className="fridge-sec__header">
        <h2 className="fridge-sec__title">오늘의 냉장고</h2>
        <span className="fridge-sec__count">총 {FRIDGE_ITEMS.length}개 재료</span>
      </div>

      <div className="fridge-sec__scroll">
        {/* 재료 추가 버튼 */}
        <div className="fridge-item">
          <button
            className="fridge-add-btn"
            aria-label="재료 추가"
            onClick={() => { window.location.hash = '#/meal-grocery' }}
          >
            <img src={fridgeIcon} alt="" width="32" height="32" />
            <span className="fridge-add-btn__plus" aria-hidden="true">+</span>
          </button>
          <span className="fridge-item__name">재료추가</span>
        </div>

        {FRIDGE_ITEMS.map(item => (
          <div key={item.id} className="fridge-item">
            <div className="fridge-circle-wrap">
              <div className={`fridge-circle${item.daysLeft !== null ? ' fridge-circle--urgent' : ''}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={`fridge-circle__img ${getIngredientIconClassName(item.image)}`}
                />
              </div>
              {item.daysLeft !== null && (
                <span className="fridge-badge" aria-label={`D-${item.daysLeft}`}>D-{item.daysLeft}</span>
              )}
            </div>
            <span className="fridge-item__name">{item.name}</span>
          </div>
        ))}
      </div>

      {urgentCount > 0 && (
        <button
          className="fridge-warning"
          onClick={() => { window.location.hash = '#/meal-storage' }}
          aria-label="소비기한 임박 재료 확인하기"
        >
          <span className="fridge-warning__icon" aria-hidden="true">💡</span>
          <span className="fridge-warning__text">소비기한이 임박한 재료가 있어요 !</span>
          <span className="fridge-warning__arrow" aria-hidden="true">›</span>
        </button>
      )}

      {/* 도락마켓 배너 */}
      <div
        className="market-banner"
        role="button"
        tabIndex={0}
        onClick={() => { window.location.hash = '#/store' }}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.hash = '#/store' }}
        aria-label="도락마켓으로 이동"
      >
        <div className="market-banner__text">
          <p className="market-banner__desc">지금 필요한 신선한 재료,</p>
          <strong className="market-banner__name">도락마켓에서 만나기</strong>
          <span className="market-banner__link">바로가기 &gt;</span>
        </div>
        <div className="market-banner__mascots" aria-hidden="true">
          <img src={dorak01} alt="" className="market-banner__mascot" />
          <img src={dorak02} alt="" className="market-banner__mascot" />
          <img src={dorak03} alt="" className="market-banner__mascot market-banner__mascot--front" />
        </div>
      </div>
    </section>
  )
}

export default FridgeSection

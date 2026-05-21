import {
  carrotImg, potatoImg, appleImg, onionImg, brocollyImg,
  getIngredientIconClassName,
} from '../meal/mealData'
import mushRoomImg from '../../assets/images/food_icon/mushroom.png'
import tomatoImg from '../../assets/images/food_icon/tomato.png'
import dorak21 from '../../assets/food_mascot_all/dorkak21.png'
import blueStuffImg from './images/blue_stuff.png'
import lightImg from './images/light.png'
import './FridgeSection.css'

interface FridgeIngredient {
  id: number
  name: string
  image: string
  daysLeft: number | null
}

const FRIDGE_ITEMS: FridgeIngredient[] = [
  { id: 1, name: '당근', image: carrotImg, daysLeft: 1 },
  { id: 2, name: '감자', image: potatoImg, daysLeft: 5 },
  { id: 3, name: '사과', image: appleImg, daysLeft: 3 },
  { id: 4, name: '양파', image: onionImg, daysLeft: 2 },
  { id: 5, name: '브로콜리', image: brocollyImg, daysLeft: 7 },
  { id: 6, name: '버섯', image: mushRoomImg, daysLeft: 1 },
  { id: 7, name: '방울토마토', image: tomatoImg, daysLeft: 4 },
]

const urgentCount = FRIDGE_ITEMS.filter(i => i.daysLeft !== null).length

function FridgeSection() {
  return (
    <section className="fridge-sec">
      <div className="fridge-card">
        <div className="fridge-sec__header">
          <h2 className="fridge-sec__title">오늘의 냉장고</h2>
          <span className="fridge-sec__count">총 <span className="fridge-sec__count-num">{FRIDGE_ITEMS.length}개</span> 재료</span>
        </div>

        <div className="fridge-sec__body">
          <div className="fridge-item fridge-item--add">
            <button
              className="fridge-add-btn"
              aria-label="재료 추가"
              onClick={() => { window.location.hash = '#/meal-grocery' }}
            >
              <img src={blueStuffImg} alt="" className="fridge-add-btn__img" />
              <span className="fridge-add-btn__plus" aria-hidden="true">+</span>
            </button>
            <span className="fridge-item__name">재료추가</span>
          </div>

          <div className="fridge-sec__scroll">
            {FRIDGE_ITEMS.map(item => (
              <div key={item.id} className="fridge-item">
                <div className="fridge-circle">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`fridge-circle__img ${getIngredientIconClassName(item.image)}`}
                  />
                </div>
                <span className="fridge-item__name">{item.name}</span>
                {item.daysLeft !== null && (
                  <span className={`fridge-badge${item.daysLeft <= 2 ? ' fridge-badge--urgent' : ''}`} aria-label={`D-${item.daysLeft}`}>D-{item.daysLeft}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {urgentCount > 0 && (
          <button
            className="fridge-warning"
            onClick={() => { window.location.hash = '#/meal-storage' }}
            aria-label="소비기한 임박 재료 확인하기"
          >
            <img src={lightImg} alt="" className="fridge-warning__icon" aria-hidden="true" />
            <span className="fridge-warning__text">소비기한이 임박한 재료가 있어요 !</span>
            <svg className="fridge-warning__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18L15 12L9 6" stroke="#92BA6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

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
          <img src={dorak21} alt="" className="market-banner__mascot" />
        </div>
      </div>
    </section>
  )
}

export default FridgeSection

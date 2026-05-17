import {
  carrotImg, potatoImg, appleImg, onionImg,
  romainImg, brocollyImg, strawberryImg,
  getIngredientIconClassName,
} from '../mealData'
import './IngredientSection.css'

interface Ingredient {
  id: number
  name: string
  image: string
  daysLeft: number | null
}

const INGREDIENTS: Ingredient[] = [
  { id: 1, name: '당근', image: carrotImg, daysLeft: null },
  { id: 2, name: '감자', image: potatoImg, daysLeft: null },
  { id: 3, name: '사과', image: appleImg, daysLeft: null },
  { id: 4, name: '양파', image: onionImg, daysLeft: 1 },
  { id: 5, name: '양상추', image: romainImg, daysLeft: null },
  { id: 6, name: '브로콜리', image: brocollyImg, daysLeft: null },
  { id: 7, name: '딸기', image: strawberryImg, daysLeft: null },
]

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function IngredientSection() {
  return (
    <section className="ing-section">
      <div className="ing-header">
        <div className="ing-header__text">
          <h2 className="ing-title">이번주<br />냉털 계획표</h2>
          <p className="ing-subtitle">한 주 도시락을 미리 채워보세요!</p>
        </div>
        <button className="cal-icon-btn" aria-label="달력 열기" onClick={() => { window.location.hash = '#/meal-weekly-plan' }}>
          <CalendarIcon />
        </button>
      </div>

      <div className="ing-scroll">
        <div className="ing-item">
          <button className="ing-add-btn" aria-label="재료 추가" onClick={() => { window.location.hash = '#/meal-grocery' }}>
            <span className="ing-add-plus">+</span>
          </button>
          <span className="ing-name">재료추가</span>
        </div>
        {INGREDIENTS.map((item) => (
          <div key={item.id} className="ing-item">
            <div className="ing-circle-wrap">
              <div className={`ing-circle${item.daysLeft !== null ? ' ing-circle--urgent' : ''}`}>
                <img src={item.image} alt={item.name} className={`ing-img ${getIngredientIconClassName(item.image)}`} />
              </div>
              {item.daysLeft !== null && (
                <span className="ing-urgent-badge">D-{item.daysLeft}</span>
              )}
            </div>
            <span className="ing-name">{item.name}</span>
          </div>
        ))}
      </div>

    </section>
  )
}

export default IngredientSection

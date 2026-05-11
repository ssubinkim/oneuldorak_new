import {
  carrotImg, potatoImg, appleImg, onionImg,
  romainImg, brocollyImg, strawberryImg,
} from './mealData'
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

function FridgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="1.5" width="14" height="15" rx="3" stroke="#333" strokeWidth="1.5" />
      <path d="M2 7.5h14" stroke="#333" strokeWidth="1.5" />
      <path d="M6.5 4.5v1.5M6.5 10v2" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IngredientSection() {
  return (
    <section className="ing-section">
      <div className="ing-header">
        <FridgeIcon />
        <span className="ing-title">냉장고 재료 모아보기</span>
        <button className="ing-more-btn">전체 {INGREDIENTS.length}개 &gt;</button>
      </div>

      <div className="ing-scroll">
        {INGREDIENTS.map((item) => (
          <div key={item.id} className="ing-item">
            <div className="ing-circle-wrap">
              <div className={`ing-circle${item.daysLeft !== null ? ' ing-circle--urgent' : ''}`}>
                <img src={item.image} alt={item.name} className="ing-img" />
              </div>
              {item.daysLeft !== null && (
                <span className="ing-urgent-badge">D-{item.daysLeft}</span>
              )}
            </div>
            <span className="ing-name">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="ing-actions">
        <button className="ing-btn ing-btn--primary">재료추가하기</button>
        <button className="ing-btn ing-btn--outline">모든 재료 보러가기</button>
      </div>
    </section>
  )
}

export default IngredientSection

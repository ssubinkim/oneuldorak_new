import { weeklyMenuData } from './mealData'
import bookOpenImg from '../../pages/meal/images/book_open.svg'
import './TodayMenuList.css'

interface Props {
  selectedDay: number
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="star-rating">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? 'star star-filled' : 'star star-empty'}>★</span>
      ))}
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginRight: 3 }}>
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function TodayMenuList({ selectedDay }: Props) {
  const menu = weeklyMenuData.find(m => m.date === selectedDay) ?? weeklyMenuData[0]

  if (!menu.image && menu.status === 'thinking') {
    return (
      <div className="today-empty-card">
        <p className="today-empty-text">아직 메뉴를 정하지 않았어요!</p>
        <p className="today-empty-sub">도락이에게 추천받아보세요 🐶</p>
      </div>
    )
  }

  return (
    <div className="today-card">
      <div className="today-header">
        <div className="today-img-wrapper">
          {menu.image && (
            <img
              className="today-img"
              src={menu.image}
              alt={menu.name}
              onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
            />
          )}
        </div>
        <div className="today-title-section">
          <p className="today-name">{menu.name}</p>
          {menu.calories && <p className="today-calories">{menu.calories}kcal</p>}
          {menu.description && <p className="today-desc">{menu.description}</p>}
        </div>
      </div>

      <div className="today-stats">
        <div className="today-stat">
          <p className="stat-label">절약금액</p>
          <p className="stat-value stat-blue">{menu.savedAmount.toLocaleString()}원</p>
        </div>
        <div className="today-stat-divider" />
        <div className="today-stat">
          <p className="stat-label">난이도</p>
          <StarRating value={menu.difficulty} />
        </div>
        <div className="today-stat-divider" />
        <div className="today-stat">
          <p className="stat-label">조리시간</p>
          <p className="stat-value stat-time">
            <ClockIcon />
            약 {menu.time ?? '-'}
          </p>
        </div>
      </div>

      {menu.ingredients.length > 0 && (
        <div className="today-ingredients-section">
          <p className="today-ingredients-title">필요한 재료</p>
          <div className="today-ingredients-list">
            {menu.ingredients.map(ing => (
              <div key={ing.name} className="today-ingredient">
                <img className="ingredient-img" src={ing.image} alt={ing.name} />
                <span className="ingredient-name">{ing.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="today-recipe-btn">
        <img src={bookOpenImg} alt="" className="today-recipe-btn-icon" />
        레시피 보러가기
      </button>
    </div>
  )
}

export default TodayMenuList

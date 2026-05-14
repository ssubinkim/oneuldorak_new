import { useEffect, useRef, useState } from 'react'
import { getIngredientIconClassName, weeklyMenuData } from '../mealData'
import moneyBagImg from '../../../assets/icons/money_bag.svg'
import HomeQuickActions from '../../home/HomeQuickActions'
import './TodayMenuList.css'

interface Props {
  selectedDay: number
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.786133 16.1071C0.786133 13.3981 1.86228 10.8001 3.77783 8.88455C5.69338 6.969 8.29142 5.89285 11.0004 5.89285C13.7094 5.89285 16.3075 6.969 18.223 8.88455C20.1386 10.8001 21.2147 13.3981 21.2147 16.1071H0.786133Z" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.786133 20.0357H21.2147" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 5.89287V1.96429" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.64355 1.96429H13.3578" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}



const slides = weeklyMenuData.filter(m => m.image !== null)
const monthlySavings = weeklyMenuData.reduce((sum, m) => sum + m.savedAmount, 0)

function TodayMenuList({ selectedDay: _ }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const currentMenu = slides[currentIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCurrentIndex(prev => (prev + 1) % slides.length)
      else setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length)
    }
  }

  return (
    <div className="today-card">
      <div className="today-card-header">
        <BellIcon />
        <span className="today-card-title">오늘의 추천 메뉴</span>
        <button className="today-menu-add-btn">+ 메뉴추가</button>
      </div>

      <div className="today-header">
        <div
          className="today-img-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="today-slides-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="today-slide">
                <img className="today-img" src={slide.image!} alt={slide.name} />
                <div className="today-img-gradient" />
                <div className="today-img-overlay">
                  {slide.time && <span className="today-time-badge">{slide.time}</span>}
                  <p className="today-name">{slide.name}</p>
                  {slide.description && <p className="today-desc">{slide.description}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="today-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`today-dot${i === currentIndex ? ' today-dot--active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {currentMenu.ingredients.length > 0 && (
        <div className="today-ingredients-section">
          <p className="today-ingredients-title">필요한 재료</p>
          <div className="today-ingredients-list">
            {currentMenu.ingredients.map(ing => (
              <div key={ing.name} className="today-ingredient">
                <img className={`ingredient-img ${getIngredientIconClassName(ing.image)}`} src={ing.image} alt={ing.name} />
                <span className="ingredient-name">{ing.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="today-savings">
        <div className="savings-card">
          <img src={moneyBagImg} alt="" className="savings-icon" />
          <div className="savings-info">
            <p className="savings-label">오늘 예상 절약</p>
            <p className="savings-amount savings-amount--blue">{currentMenu.savedAmount.toLocaleString()}원</p>
          </div>
        </div>
        <div className="savings-card">
          <span className="savings-icon savings-icon--emoji">🪙</span>
          <div className="savings-info">
            <p className="savings-label">이번 달 누적 절약</p>
            <p className="savings-amount savings-amount--yellow">{monthlySavings.toLocaleString()}원</p>
          </div>
        </div>
      </div>
      <HomeQuickActions />
    </div>
  )
}

export default TodayMenuList

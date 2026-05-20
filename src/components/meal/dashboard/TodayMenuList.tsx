import { useEffect, useRef, useState } from 'react'
import { getIngredientIconClassName, weeklyMenuData } from '../mealData'
import menuAddBtnImg from '../images/menu-add-btn.svg'
import savings1Img from '../images/savings_1.svg'
import HomeQuickActions from '../../home/HomeQuickActions'
import './TodayMenuList.css'

interface Props {
  selectedDay: number
  onAddClick?: () => void
}


const slides = weeklyMenuData.filter(m => m.image !== null)

function TodayMenuList({ onAddClick }: Props) {
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
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.786133 16.1071C0.786133 13.3981 1.86228 10.8001 3.77783 8.88455C5.69338 6.969 8.29142 5.89285 11.0004 5.89285C13.7094 5.89285 16.3075 6.969 18.223 8.88455C20.1386 10.8001 21.2147 13.3981 21.2147 16.1071H0.786133Z" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M0.786133 20.0357H21.2147" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 5.89287V1.96429" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.64355 1.96429H13.3578" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="today-card-title">오늘의 추천 메뉴</span>
      </div>
      <button className="today-menu-add-btn" onClick={onAddClick}>
        <img src={menuAddBtnImg} alt="메뉴 추가" width={75} height={36} loading="lazy" decoding="async" fetchPriority="low" />
      </button>

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
                <img
                  className="today-img"
                  src={slide.image!}
                  alt={slide.name}
                  width={360}
                  height={210}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding={i === 0 ? 'sync' : 'async'}
                />
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
                <img
                  className={`ingredient-img ${getIngredientIconClassName(ing.image)}`}
                  src={ing.image}
                  alt={ing.name}
                  width={52}
                  height={52}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <span className="ingredient-name">{ing.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="today-savings">
        <div className="savings-card">
          <img src={savings1Img} alt="" className="savings-icon" width={68} height={68} loading="lazy" decoding="async" fetchPriority="low" />
          <div className="savings-info">
            <p className="savings-label">오늘 메뉴로</p>
            <p className="savings-amount savings-amount--blue">
              {currentMenu.savedAmount.toLocaleString()}원
              <span className="savings-suffix">절약할수있어요!</span>
            </p>
          </div>
        </div>
      </div>
      <HomeQuickActions />
    </div>
  )
}

export default TodayMenuList

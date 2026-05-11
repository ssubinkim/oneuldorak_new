import { useEffect, useRef, useState } from 'react'
import {
  carrotImg, potatoImg, appleImg, onionImg, romainImg,
  brocollyImg, beansproutsImg,
} from '../mealData'

interface Props {
  onShowAll: () => void
}

const recipeCards = [
  { id: 1, title: '차돌 된장찌개' },
  { id: 2, title: '토마토 파스타' },
  { id: 3, title: '순두부찌개' },
]

const previewIngredients = [
  { id: 1, image: carrotImg, name: '당근' },
  { id: 2, image: potatoImg, name: '감자' },
  { id: 3, image: appleImg, name: '사과' },
  { id: 4, image: onionImg, name: '양파' },
  { id: 5, image: romainImg, name: '양상추' },
  { id: 6, image: brocollyImg, name: '브로콜리' },
  { id: 7, image: beansproutsImg, name: '콩나물' },
]

const initialChecklistItems = [
  { id: 1, name: '감자', checked: true },
  { id: 2, name: '양배추', checked: false },
  { id: 3, name: '차돌박이', checked: false },
  { id: 4, name: '간장, 고춧가루', checked: true },
  { id: 5, name: '사과', checked: true },
  { id: 6, name: '깻잎', checked: true },
  { id: 7, name: '목살, 삼겹살', checked: true },
]

const possibleRecipes = [
  { id: 1, title: '김치볶음밥', tags: '김치찌개, 김치찜, 김치전, 김치볶음밥,' },
  { id: 2, title: '된장찌개', tags: '김치찌개, 김치찜, 김치전, 김치볶음밥,' },
  { id: 3, title: '블루베리 요거트', tags: '김치찌개, 김치찜, 김치전, 김치볶음밥,' },
]

function StorageMain({ onShowAll }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentBottomSlide, setCurrentBottomSlide] = useState(0)
  const [checklistItems, setChecklistItems] = useState(initialChecklistItems)

  const toggleChecklist = (id: number) => {
    setChecklistItems(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    )
  }
  const dragStartX = useRef(0)
  const isDragging = useRef(false)
  const bottomDragStartX = useRef(0)
  const isBottomDragging = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % recipeCards.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const slide = (startX: number, endX: number) => {
    const diff = startX - endX
    if (Math.abs(diff) > 40) {
      setCurrentSlide(prev =>
        diff > 0 ? Math.min(prev + 1, recipeCards.length - 1) : Math.max(prev - 1, 0)
      )
    }
  }

  const bottomSlide = (startX: number, endX: number) => {
    const diff = startX - endX
    if (Math.abs(diff) > 40) {
      setCurrentBottomSlide(prev =>
        diff > 0 ? Math.min(prev + 1, 2) : Math.max(prev - 1, 0)
      )
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => { dragStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => { slide(dragStartX.current, e.changedTouches[0].clientX) }
  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; dragStartX.current = e.clientX }
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    slide(dragStartX.current, e.clientX)
  }
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    slide(dragStartX.current, e.clientX)
  }

  const handleBottomTouchStart = (e: React.TouchEvent) => { bottomDragStartX.current = e.touches[0].clientX }
  const handleBottomTouchEnd = (e: React.TouchEvent) => { bottomSlide(bottomDragStartX.current, e.changedTouches[0].clientX) }
  const handleBottomMouseDown = (e: React.MouseEvent) => { isBottomDragging.current = true; bottomDragStartX.current = e.clientX }
  const handleBottomMouseUp = (e: React.MouseEvent) => {
    if (!isBottomDragging.current) return
    isBottomDragging.current = false
    bottomSlide(bottomDragStartX.current, e.clientX)
  }
  const handleBottomMouseLeave = (e: React.MouseEvent) => {
    if (!isBottomDragging.current) return
    isBottomDragging.current = false
    bottomSlide(bottomDragStartX.current, e.clientX)
  }

  return (
    <div className="storage-main">
      <div className="storage-header">
        <h2 className="storage-title">내 재료 보관함</h2>
        <button className="storage-add-btn" onClick={onShowAll}>재료추가 +</button>
      </div>

      <div className="storage-carousel-wrapper">
        <div
          className="storage-carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {recipeCards.map(card => (
            <div key={card.id} className="storage-carousel-card">
              <p className="storage-recipe-desc">
                세아님, 냉장고 재료로<br />이런 메뉴를 만들수있어요!
              </p>
              <p className="storage-recipe-name">{card.title}</p>
            </div>
          ))}
        </div>
        <div className="storage-carousel-dots">
          {recipeCards.map((_, i) => (
            <button
              key={i}
              className={`storage-carousel-dot${i === currentSlide ? ' active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </div>

      <div className="storage-ingredients-section">
        <div className="storage-date">5월 14일</div>
        <div className="storage-preview-grid">
          {previewIngredients.map(item => (
            <div key={item.id} className="storage-item">
              <div className="storage-item-emoji">
                <img className="storage-item-img" src={item.image} alt={item.name} />
              </div>
              <span className="storage-item-name">{item.name}</span>
            </div>
          ))}
        </div>
        <button className="storage-see-all-btn" onClick={onShowAll}>
          모든 재료 보러가기
        </button>
      </div>

      <div className="storage-bottom-section">
        <div
          className="storage-bottom-track"
          style={{ transform: `translateX(-${currentBottomSlide * 100}%)` }}
          onTouchStart={handleBottomTouchStart}
          onTouchEnd={handleBottomTouchEnd}
          onMouseDown={handleBottomMouseDown}
          onMouseUp={handleBottomMouseUp}
          onMouseLeave={handleBottomMouseLeave}
        >
          <div className="storage-bottom-panel">
            <div className="storage-checklist-card">
              <p className="storage-checklist-title">장보기 체크리스트</p>
              <p className="storage-checklist-date">5월 14일</p>
              <ul className="storage-checklist">
                {checklistItems.map(item => (
                  <li
                    key={item.id}
                    className="storage-checklist-item"
                    onClick={() => toggleChecklist(item.id)}
                  >
                    <span className={`storage-checkbox ${item.checked ? 'is-checked' : ''}`} />
                    <span className="storage-checklist-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="storage-bottom-panel">
            <div className="storage-recipes-list">
              {possibleRecipes.map(recipe => (
                <div key={recipe.id} className="storage-recipe-row">
                  <div className="storage-recipe-img-placeholder" />
                  <div className="storage-recipe-info">
                    <p className="storage-recipe-row-title">{recipe.title}</p>
                    <p className="storage-recipe-row-type">가능한 요리</p>
                    <p className="storage-recipe-row-tags">{recipe.tags}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="storage-bottom-panel">
            <div className="storage-recommend-card">
              <p className="storage-recommend-title">오늘의 추천 재료</p>
              <div className="storage-recommend-img-placeholder" />
              <p className="storage-recommend-name">봄동</p>
              <p className="storage-recommend-desc">
                봄동은 몸에도 좋고<br />
                머리에도 좋고<br />
                기분도 좋아지고<br />
                봄에 제철음식이랍니다.<br />
                꼭 먹어보세요~~
              </p>
            </div>
          </div>
        </div>

        <div className="storage-bottom-dots">
          {['장보기 체크리스트', '가능한 요리', '오늘의 추천 재료'].map((label, i) => (
            <button
              key={i}
              className={`storage-carousel-dot${i === currentBottomSlide ? ' active' : ''}`}
              onClick={() => setCurrentBottomSlide(i)}
              title={label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StorageMain

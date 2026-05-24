import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import bulgogiImage from '../../assets/images/food_imges/bulgogi.png'
import chamchiMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import omuriceImage from '../../assets/images/food_imges/omurice.png'
import ssoyaImage from '../../assets/images/food_imges/ssoya.png'
import noodlesImage from '../../assets/images/food_imges/noodles.jpg'
import threeNextImg from '../../assets/food_mascot/three_next.png'
import MealBookOpenIcon from '../../assets/icons/meal_book_open.svg?react'
import GroupIcon from '../../assets/icons/Group.svg?react'
import './TodayRecipeSection.css'

const RECIPE_SLIDES = [
  { name: '깍두기 볶음밥', meta: '5000원 | 30분 | 초보', image: kimchiRiceImage, recipeId: 'recipe-1' },
  { name: '비빔밥', meta: '6500원 | 20분 | 초보', image: bibimbapImage, recipeId: 'recipe-2' },
  { name: '불고기 덮밥', meta: '8000원 | 25분 | 보통', image: bulgogiImage, recipeId: 'recipe-3' },
  { name: '참치마요 덮밥', meta: '4500원 | 15분 | 초보', image: chamchiMayoImage, recipeId: 'recipe-1' },
  { name: '오므라이스', meta: '6000원 | 25분 | 보통', image: omuriceImage, recipeId: 'recipe-2' },
  { name: '쏘야볶음', meta: '5500원 | 15분 | 초보', image: ssoyaImage, recipeId: 'recipe-3' },
  { name: '잔치국수', meta: '5000원 | 20분 | 초보', image: noodlesImage, recipeId: 'recipe-1' },
]

const LOOPED_RECIPE_SLIDES = [
  RECIPE_SLIDES[RECIPE_SLIDES.length - 1],
  ...RECIPE_SLIDES,
  RECIPE_SLIDES[0],
]

function TodayRecipeSection() {
  const [displayRecipeIndex, setDisplayRecipeIndex] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    hasDragged: false,
    startX: 0,
  })

  const activeRecipeIndex =
    (displayRecipeIndex - 1 + RECIPE_SLIDES.length) % RECIPE_SLIDES.length
  const activeRecipe = RECIPE_SLIDES[activeRecipeIndex]
  const progress = ((activeRecipeIndex + 1) / RECIPE_SLIDES.length) * 100

  const goRecipePage = () => { window.location.hash = '#/recipe' }
  const goRecipeDetail = () => { window.location.hash = `#/recipe?id=${activeRecipe.recipeId}&from=home` }
  const goSaved = () => { window.location.hash = '#/meal-grocery?tab=storage&from=home' }

  const disableTransition = () => {
    if (trackRef.current) trackRef.current.style.transition = 'none'
  }

  const enableTransition = () => {
    if (trackRef.current) trackRef.current.style.transition = ''
  }

  useEffect(() => {
    if (isDragging) return

    const slideTimer = window.setInterval(() => {
      setDisplayRecipeIndex((current) => current + 1)
    }, 3000)

    return () => {
      window.clearInterval(slideTimer)
    }
  }, [isDragging])

  const handleSlidePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragStateRef.current = {
      hasDragged: false,
      startX: event.clientX,
    }
    disableTransition()
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleSlidePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const distance = event.clientX - dragStateRef.current.startX
    setDragOffset(distance)

    if (Math.abs(distance) > 4) {
      dragStateRef.current.hasDragged = true
    }
  }

  const endSlideDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const distance = event.clientX - dragStateRef.current.startX
    const shouldMove = Math.abs(distance) > 36

    enableTransition()

    if (shouldMove && distance < 0) {
      setDisplayRecipeIndex((current) => current + 1)
    } else if (shouldMove && distance > 0) {
      setDisplayRecipeIndex((current) => current - 1)
    }

    setDragOffset(0)
    setIsDragging(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleTrackTransitionEnd = () => {
    if (displayRecipeIndex === RECIPE_SLIDES.length + 1) {
      disableTransition()
      setDisplayRecipeIndex(1)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          enableTransition()
        })
      })
    }

    if (displayRecipeIndex === 0) {
      disableTransition()
      setDisplayRecipeIndex(RECIPE_SLIDES.length)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          enableTransition()
        })
      })
    }
  }

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.hasDragged) {
      event.preventDefault()
      dragStateRef.current.hasDragged = false
      return
    }

    goRecipeDetail()
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goRecipeDetail()
    }
  }

  return (
    <section className="recipe-sec">
      <div className="recipe-sec__header">
        <div className="recipe-sec__header-text">
          <h2 className="recipe-sec__title">오늘의 도시락 레시피</h2>
          <p className="recipe-sec__sub">도락이들의 레시피 이야기</p>
        </div>
        <button className="recipe-page-card" onClick={goRecipePage} aria-label="레시피 페이지로 이동">
          <img src={threeNextImg} alt="레시피 페이지로 이동" className="recipe-page-card__mascot" />
        </button>
      </div>

      <div
        className="recipe-img-card"
        role="button"
        tabIndex={0}
        onKeyDown={handleCardKeyDown}
        aria-label={`${activeRecipe.name.replace('\n', ' ')} 레시피 보기`}
      >
        <div
          className="recipe-img-card__viewport"
          onPointerDown={handleSlidePointerDown}
          onPointerMove={handleSlidePointerMove}
          onPointerUp={endSlideDrag}
          onPointerCancel={endSlideDrag}
          onClick={handleCardClick}
        >
          <div
            ref={trackRef}
            className="recipe-img-card__track"
            style={{ transform: `translateX(calc(${-displayRecipeIndex * 100}% + ${dragOffset}px))` }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {LOOPED_RECIPE_SLIDES.map((recipe, index) => (
              <img
                key={`${recipe.name}-${index}`}
                src={recipe.image}
                alt={recipe.name.replace('\n', ' ')}
                className="recipe-img-card__img"
                draggable={false}
              />
            ))}
          </div>
        </div>

        <span className="recipe-img-card__badge">
          {activeRecipeIndex + 1}/{RECIPE_SLIDES.length}
        </span>
        <div className="recipe-img-card__overlay">
          <span className="recipe-img-card__best-badge">
            <GroupIcon width="12" height="11" aria-hidden="true" />
            BEST
          </span>
          <span className="recipe-img-card__name">
            {activeRecipe.name.split('\n').map((line, lineIndex) => (
              <span key={line}>
                {lineIndex > 0 && <br />}
                {line}
              </span>
            ))}
          </span>
          <span className="recipe-img-card__meta">{activeRecipe.meta}</span>
        </div>
        <span className="recipe-img-card__progress" aria-hidden="true">
          <span className="recipe-img-card__progress-fill" style={{ width: `${progress}%` }} />
        </span>
      </div>

      <button className="saved-recipe" onClick={goSaved} aria-label="레시피 보관함 바로가기">
        <div className="saved-recipe__left">
          <MealBookOpenIcon className="saved-recipe__icon" width="18" height="18" aria-hidden="true" />
          <div className="saved-recipe__text">
            <span className="saved-recipe__title">레시피 보관함 바로가기</span>
          </div>
        </div>
        <svg className="saved-recipe__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  )
}

export default TodayRecipeSection

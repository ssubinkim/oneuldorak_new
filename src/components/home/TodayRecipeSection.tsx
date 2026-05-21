import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import bulgogiImage from '../../assets/images/food_imges/bulgogi.png'
import chamchiMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import omuriceImage from '../../assets/images/food_imges/omurice.png'
import ssoyaImage from '../../assets/images/food_imges/ssoya.png'
import noodlesImage from '../../assets/images/food_imges/noodles.jpg'
import twoRecipesImg from '../../assets/food_mascot/two_recipes.png'
import threeRecipesImg from '../../assets/food_mascot/three_recipes.png'
import bookOpenIcon from '../../assets/icons/book_open.svg'
import './TodayRecipeSection.css'

const RECIPE_SLIDES = [
  { name: '깍두기\n볶음밥', meta: '5000원 | 30분 | 초보', image: kimchiRiceImage },
  { name: '비빔밥', meta: '6500원 | 20분 | 초보', image: bibimbapImage },
  { name: '불고기\n덮밥', meta: '8000원 | 25분 | 보통', image: bulgogiImage },
  { name: '참치마요\n덮밥', meta: '4500원 | 15분 | 초보', image: chamchiMayoImage },
  { name: '오므라이스', meta: '6000원 | 25분 | 보통', image: omuriceImage },
  { name: '쏘야볶음', meta: '5500원 | 15분 | 초보', image: ssoyaImage },
  { name: '잔치국수', meta: '5000원 | 20분 | 초보', image: noodlesImage },
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
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
  const dragStateRef = useRef({
    hasDragged: false,
    startX: 0,
  })

  const activeRecipeIndex =
    (displayRecipeIndex - 1 + RECIPE_SLIDES.length) % RECIPE_SLIDES.length
  const activeRecipe = RECIPE_SLIDES[activeRecipeIndex]
  const progress = ((activeRecipeIndex + 1) / RECIPE_SLIDES.length) * 100

  const goRecipe = () => { window.location.hash = '#/community?tab=recipe' }
  const goSaved = () => { window.location.hash = '#/mypage?tab=saved' }

  useEffect(() => {
    if (isDragging) return

    const slideTimer = window.setInterval(() => {
      setIsTransitionEnabled(true)
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
    setIsTransitionEnabled(false)
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

    setIsTransitionEnabled(true)

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
      setIsTransitionEnabled(false)
      setDisplayRecipeIndex(1)
      window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true)
      })
    }

    if (displayRecipeIndex === 0) {
      setIsTransitionEnabled(false)
      setDisplayRecipeIndex(RECIPE_SLIDES.length)
      window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true)
      })
    }
  }

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.hasDragged) {
      event.preventDefault()
      dragStateRef.current.hasDragged = false
      return
    }

    goRecipe()
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goRecipe()
    }
  }

  return (
    <section className="recipe-sec">
      <div className="recipe-sec__header">
        <h2 className="recipe-sec__title">오늘의 도시락 레시피</h2>
        <p className="recipe-sec__sub">도락이들의 인기 레시피를 만나보세요</p>
      </div>

      <div className="recipe-sec__grid">
        <button className="recipe-page-card" onClick={goRecipe} aria-label="레시피 페이지로 이동">
          <span className="recipe-page-card__label">레시피 페이지</span>
          <img src={twoRecipesImg} alt="" className="recipe-page-card__mascot" aria-hidden="true" />
          <span className="recipe-page-card__arrow" aria-hidden="true">바로가기 &gt;</span>
        </button>

        <div
          className="recipe-img-card"
          role="button"
          tabIndex={0}
          onClick={handleCardClick}
          onKeyDown={handleCardKeyDown}
          aria-label={`${activeRecipe.name.replace('\n', ' ')} 레시피 보기`}
        >
          <div
            className="recipe-img-card__viewport"
            onPointerDown={handleSlidePointerDown}
            onPointerMove={handleSlidePointerMove}
            onPointerUp={endSlideDrag}
            onPointerCancel={endSlideDrag}
            onPointerLeave={endSlideDrag}
          >
            <div
              className={[
                'recipe-img-card__track',
                isDragging ? 'is-dragging' : '',
                isTransitionEnabled ? '' : 'is-instant',
              ].filter(Boolean).join(' ')}
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
      </div>

      <button className="saved-recipe" onClick={goSaved} aria-label="내 레시피 보관함 바로가기">
        <div className="saved-recipe__text">
          <div className="saved-recipe__top">
            <img src={bookOpenIcon} alt="" width="18" height="18" aria-hidden="true" />
            <span className="saved-recipe__title">내 레시피 보관함</span>
          </div>
          <span className="saved-recipe__sub">저장한 레시피 보러가기</span>
          <span className="saved-recipe__link">바로가기 &gt;</span>
        </div>
        <div className="saved-recipe__mascots" aria-hidden="true">
          <img src={threeRecipesImg} alt="" className="saved-recipe__mascot" />
        </div>
      </button>
    </section>
  )
}

export default TodayRecipeSection

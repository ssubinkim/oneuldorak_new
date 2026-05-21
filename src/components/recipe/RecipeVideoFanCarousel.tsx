import { useState, useRef, useEffect, useCallback } from 'react'
import type { VideoRecipe } from './RecipeVideoCard'
import './RecipeVideoFanCarousel.css'

function getLoopedOffset(index: number, activeIndex: number, count: number): number {
  if (count <= 1) return 0
  let offset = index - activeIndex
  const half = count / 2
  if (offset > half) offset -= count
  if (offset < -half) offset += count
  return offset
}

type Props = {
  recipes: VideoRecipe[]
  autoPlayInterval?: number
  onOpenDetail?: (recipeId: string) => void
}

function RecipeVideoFanCarousel({ recipes, autoPlayInterval = 4000, onOpenDetail }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)
  const didSwipeRef = useRef(false)

  // active 카드만 play
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex) {
        video.currentTime = 0
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  const advance = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % recipes.length)
  }, [recipes.length])

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(advance, autoPlayInterval)
  }, [advance, autoPlayInterval])

  useEffect(() => {
    startAutoSlide()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startAutoSlide])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY }
    didSwipeRef.current = false
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const start = swipeStartRef.current
    swipeStartRef.current = null
    startAutoSlide()

    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    const isHorizontal = Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2

    if (!isHorizontal) return
    didSwipeRef.current = true
    setActiveIndex(prev => {
      const next = prev + (dx < 0 ? 1 : -1)
      return ((next % recipes.length) + recipes.length) % recipes.length
    })
  }, [startAutoSlide, recipes.length])

  const handlePointerCancel = useCallback(() => {
    swipeStartRef.current = null
    startAutoSlide()
  }, [startAutoSlide])

  return (
    <div
      className="recipe-fan-deck"
      role="list"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {recipes.map((recipe, index) => {
        const offset = getLoopedOffset(index, activeIndex, recipes.length)
        const absOffset = Math.abs(offset)
        const hidden = absOffset > 2
        const isActive = index === activeIndex
        const scale = isActive ? 1 : Math.max(0.58, 1 - absOffset * 0.22)
        const translateX = offset * 72
        const translateY = absOffset * 12
        const rotate = offset * 9
        const opacity = hidden ? 0 : Math.max(0.22, 1 - absOffset * 0.3)
        const zIndex = 100 - absOffset * 10

        return (
          <div
            key={recipe.id}
            role="listitem"
            className={`recipe-fan-card${isActive ? ' recipe-fan-card--active' : ''}`}
            style={{
              opacity,
              zIndex,
              pointerEvents: hidden ? 'none' : 'auto',
              transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
            }}
            onClick={() => {
              if (didSwipeRef.current) { didSwipeRef.current = false; return }
              if (isActive && onOpenDetail && recipe.recipeId) {
                onOpenDetail(recipe.recipeId)
                return
              }
              setActiveIndex(index)
            }}
          >
            <video
              ref={el => { videoRefs.current[index] = el }}
              className="recipe-fan-card__video"
              src={recipe.video}
              poster={recipe.poster}
              muted
              playsInline
              loop
              preload="metadata"
            />
            <div className="recipe-fan-card__overlay">
              <span className={`recipe-fan-card__likes${isActive ? ' recipe-fan-card__likes--visible' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {recipe.likes}
              </span>
              <div className={`recipe-fan-card__info${isActive ? ' recipe-fan-card__info--visible' : ''}`}>
                <h3 className="recipe-fan-card__title">{recipe.title}</h3>
                <p className="recipe-fan-card__meta">
                  {recipe.price} · {recipe.time} · {recipe.difficulty}
                </p>
              </div>
            </div>
          </div>
        )
      })}

      <div className="recipe-fan-deck__dots" aria-hidden="true">
        {recipes.map((recipe, index) => (
          <span
            key={recipe.id}
            className={`recipe-fan-deck__dot${index === activeIndex ? ' recipe-fan-deck__dot--active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default RecipeVideoFanCarousel

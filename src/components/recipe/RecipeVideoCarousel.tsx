import { useState, useRef, useEffect, useCallback } from 'react'
import RecipeVideoCard, { type VideoRecipe } from './RecipeVideoCard'

type RecipeVideoCarouselProps = {
  recipes: VideoRecipe[]
  autoPlayInterval?: number
}

const SLIDER_GAP = 12

function RecipeVideoCarousel({ recipes, autoPlayInterval = 3500 }: RecipeVideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isTouching = useRef(false)

  const scrollToIndex = useCallback((index: number) => {
    const el = sliderRef.current
    const firstWrapper = el?.querySelector<HTMLElement>('.video-card-wrapper')
    if (!el || !firstWrapper) return
    const scrollStep = firstWrapper.offsetWidth + SLIDER_GAP
    el.scrollTo({ left: index * scrollStep, behavior: 'smooth' })
  }, [])

  const goToNext = useCallback(() => {
    if (isTouching.current) return
    setActiveIndex(prev => {
      const next = (prev + 1) % recipes.length
      scrollToIndex(next)
      return next
    })
  }, [recipes.length, scrollToIndex])

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(goToNext, autoPlayInterval)
  }, [goToNext, autoPlayInterval])

  // 자동 슬라이드 시작
  useEffect(() => {
    startAutoSlide()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startAutoSlide])

  // 비디오 play/pause
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

  // 스크롤 이벤트로 activeIndex 동기화
  const handleScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    const firstWrapper = el.querySelector<HTMLElement>('.video-card-wrapper')
    if (!firstWrapper) return
    const scrollStep = firstWrapper.offsetWidth + SLIDER_GAP
    const index = Math.round(el.scrollLeft / scrollStep)
    setActiveIndex(Math.max(0, Math.min(index, recipes.length - 1)))
  }, [recipes.length])

  // 터치 시작: 자동슬라이드 일시정지
  const handleTouchStart = useCallback(() => {
    isTouching.current = true
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  // 터치 끝: 자동슬라이드 재시작
  const handleTouchEnd = useCallback(() => {
    isTouching.current = false
    startAutoSlide()
  }, [startAutoSlide])

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('scroll', handleScroll)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleScroll, handleTouchStart, handleTouchEnd])

  return (
    <>
      <div className="video-carousel" ref={sliderRef}>
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className={`video-card-wrapper${index === activeIndex ? ' video-card-wrapper--active' : ''}`}
          >
            <RecipeVideoCard
              recipe={recipe}
              isActive={index === activeIndex}
              videoRef={(el) => { videoRefs.current[index] = el }}
            />
          </div>
        ))}
      </div>

      <div className="video-carousel-dots" aria-hidden="true">
        {recipes.map((recipe, index) => (
          <span
            key={recipe.id}
            className={`video-carousel-dot${index === activeIndex ? ' video-carousel-dot--active' : ''}`}
          />
        ))}
      </div>
    </>
  )
}

export default RecipeVideoCarousel

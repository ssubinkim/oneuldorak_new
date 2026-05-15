import { useState, useRef, useEffect } from 'react'
import './StoreBanner.css'
import slide1 from './images/slide1.svg'
import slide2 from './images/slide2.svg'
import slide3 from './images/slide3.svg'
import slide4 from './images/slide4.svg'
import slide5 from './images/slide5.svg'

const SLIDES = [
  { id: 1, image: slide1, title: '오늘도 가볍고 건강하게', subtitle: '신선함이 채워지는 순간' },
  { id: 2, image: slide2, title: '자연 그대로 담아낸 한 끼', subtitle: '신선한 재료에서 건강은 시작됩니다.' },
  { id: 3, image: slide3, title: '건강한 식사는 미리 준비됩니다', subtitle: 'Simple Meals, Better Living' },
  { id: 4, image: slide4, title: '가볍게 챙기는 건강한 루틴', subtitle: '작은 준비가 하루를 바꿔요' },
  { id: 5, image: slide5, title: '식탁에도 당신의 취향을 담으세요', subtitle: 'Color Your Table, Color Your Life' },
]

const DURATION = 5000
const N = SLIDES.length
const EXTENDED = [SLIDES[N - 1], ...SLIDES, SLIDES[0]]

function StoreBanner() {
  const [pos, setPos] = useState(1)
  const [, setCurrent] = useState(0)
  const fillRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>(new Array(N + 2).fill(null))
  const posRef = useRef(1)
  const currentRef = useRef(0)
  const resetTimerRef = useRef<() => void>(() => {})
  const touchStartX = useRef<number | null>(null)

  // 실제 애니메이션 대상(.store-banner__title, .store-banner__subtitle)을 직접 재실행
  // instant=true면 딜레이 없이 즉시 재생 (루프백용)
  function triggerTextAnim(index: number, instant = false) {
    const container = textRefs.current[index]
    if (!container) return
    const title = container.querySelector<HTMLElement>('.store-banner__title')
    const subtitle = container.querySelector<HTMLElement>('.store-banner__subtitle')
    if (title) title.style.animation = 'none'
    if (subtitle) subtitle.style.animation = 'none'
    container.getBoundingClientRect()
    if (title) title.style.animation = instant ? 'banner-slide-up-title 0.7s ease 0s both' : ''
    if (subtitle) subtitle.style.animation = instant ? 'banner-slide-up-subtitle 0.45s ease 0.1s both' : ''
  }

  useEffect(() => {
    let startTime = performance.now()
    let raf: number

    resetTimerRef.current = () => { startTime = performance.now() }

    function tick(timestamp: number) {
      const pct = Math.min((timestamp - startTime) / DURATION, 1)
      const width = ((currentRef.current + pct) / N) * 100
      if (fillRef.current) fillRef.current.style.width = `${width}%`

      if (pct >= 1) {
        const nextPos = posRef.current + 1
        // 클론 위치(N+1)는 애니메이션 트리거 안 함 — 루프백 후 실제 위치에서 재생
        if (nextPos >= 1 && nextPos <= N) triggerTextAnim(nextPos)
        posRef.current = nextPos
        currentRef.current = (currentRef.current + 1) % N
        setPos(nextPos)
        setCurrent(currentRef.current)
        startTime = timestamp
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function handleTransitionEnd() {
    const track = trackRef.current
    if (!track) return

    let newPos: number | null = null
    if (posRef.current >= N + 1) newPos = 1
    else if (posRef.current <= 0) newPos = N
    if (newPos === null) return

    track.style.transition = 'none'
    track.style.transform = `translateX(-${newPos * 100}%)`
    track.getBoundingClientRect()
    track.style.transition = ''

    posRef.current = newPos
    currentRef.current = newPos - 1
    setPos(newPos)
    setCurrent(newPos - 1)
    // 딜레이 없이 즉시 텍스트 애니메이션 재생 — 루프백 시 부드럽게
    triggerTextAnim(newPos, true)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    touchStartX.current = null
    if (Math.abs(diff) < 40) return

    const newPos = diff > 0 ? posRef.current + 1 : posRef.current - 1
    if (newPos >= 1 && newPos <= N) triggerTextAnim(newPos)
    posRef.current = newPos
    currentRef.current = (currentRef.current + (diff > 0 ? 1 : -1) + N) % N
    setPos(newPos)
    setCurrent(currentRef.current)
    resetTimerRef.current()
  }

  return (
    <div className="store-banner">
      <div
        className="store-banner__track-outer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="store-banner__track"
          style={{ transform: `translateX(-${pos * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {EXTENDED.map((slide, index) => (
            <div key={index} className="store-banner__card">
              <img className="store-banner__image" src={slide.image} alt={slide.title} />
              <div className="store-banner__overlay" />
              <div
                ref={el => { textRefs.current[index] = el }}
                className="store-banner__text"
              >
                <p className="store-banner__title">{slide.title}</p>
                <p className="store-banner__subtitle">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="store-banner__progress">
        <div ref={fillRef} className="store-banner__progress-fill" />
      </div>
    </div>
  )
}

export default StoreBanner

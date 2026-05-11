import { useState, useRef, useEffect, useCallback } from 'react'
import './StoreBanner.css'
import slide1 from './images/slide1.png'
import slide2 from './images/slide2.png'
import slide3 from './images/slide3.png'
import slide4 from './images/slide4.png'
import slide5 from './images/slide5.png'

const SLIDES = [
  { id: 1, image: slide1, title: '오늘도 가볍고 건강하게', subtitle: '신선함이 채워지는 순간' },
  { id: 2, image: slide2, title: '자연 그대로 담아낸 한 끼', subtitle: '신선한 재료에서 건강은 시작됩니다.' },
  { id: 3, image: slide3, title: '건강한 식사는 미리 준비됩니다', subtitle: 'Simple Meals, Better Living' },
  { id: 4, image: slide4, title: '가볍게 챙기는 건강한 루틴', subtitle: '작은 준비가 하루를 바꿔요' },
  { id: 5, image: slide5, title: '식탁에도 당신의 취향을 담으세요', subtitle: 'Color Your Table, Color Your Life' },
]

const DURATION = 3000

function StoreBanner() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const goTo = useCallback((index: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
    setCurrent(index)
    setProgress(0)
    startTimeRef.current = null
  }, [])

  useEffect(() => {
    function tick(timestamp: number) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const pct = Math.min(((timestamp - startTimeRef.current) / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCurrent(prev => {
          const next = (prev + 1) % SLIDES.length
          const el = trackRef.current
          if (el) el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
          return next
        })
        setProgress(0)
        startTimeRef.current = null
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [current])

  function handleScroll() {
    const el = trackRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    if (index !== current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setCurrent(index)
      setProgress(0)
      startTimeRef.current = null
    }
  }

  return (
    <div className="store-banner">
      <div className="store-banner__track" ref={trackRef} onScroll={handleScroll}>
        {SLIDES.map(slide => (
          <div key={slide.id} className="store-banner__card">
            <img className="store-banner__image" src={slide.image} alt={slide.title} />
            <div className="store-banner__overlay" />
            <div className="store-banner__text">
              <p className="store-banner__title">{slide.title}</p>
              <p className="store-banner__subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="store-banner__bars">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`슬라이드 ${i + 1}`}
            className="store-banner__bar"
            onClick={() => goTo(i)}
          >
            <span
              className="store-banner__bar-fill"
              style={{
                width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default StoreBanner

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

const DURATION = 3000
const N = SLIDES.length

function StoreBanner() {
  const [current, setCurrent] = useState(0)
  const fillRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)

  // RAF 루프 한 번만 시작 — current 바뀌어도 재시작 안 함
  useEffect(() => {
    let startTime = performance.now()
    let raf: number

    function tick(timestamp: number) {
      const pct = Math.min((timestamp - startTime) / DURATION, 1)
      const width = ((currentRef.current + pct) / N) * 100
      if (fillRef.current) fillRef.current.style.width = `${width}%`

      if (pct >= 1) {
        currentRef.current = (currentRef.current + 1) % N
        startTime = timestamp
        setCurrent(currentRef.current)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="store-banner">
      <div className="store-banner__track-outer">
        <div
          className="store-banner__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
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
      </div>
      <div className="store-banner__progress">
        <div ref={fillRef} className="store-banner__progress-fill" />
      </div>
    </div>
  )
}

export default StoreBanner

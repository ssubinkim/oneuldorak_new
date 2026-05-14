import { useEffect, useRef, useState } from 'react'
import './HomeFridgeBanner.css'
import arrowIcon from './images/arrow.png'
import bannerAfter from './images/banner_after.svg'
import bannerBefore from './images/banner_before.svg'

function HomeFridgeBanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const trigger = triggerRef.current

    if (!section || !trigger) {
      return undefined
    }

    const scroller = section.closest('.home-scroll')
    const openObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsOpen(true)
        }
      },
      {
        root: scroller,
        threshold: 0,
      },
    )
    const closeObserver = new IntersectionObserver(
      ([entry]) => {
        const rootTop = scroller?.getBoundingClientRect().top ?? 0
        const isPastSection = entry.boundingClientRect.top < rootTop

        if (isPastSection && entry.intersectionRatio < 0.4) {
          setIsOpen(false)
        }
      },
      {
        root: scroller,
        threshold: [0, 0.4],
      },
    )

    openObserver.observe(trigger)
    closeObserver.observe(section)

    return () => {
      openObserver.disconnect()
      closeObserver.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`fridge-banner-stage${isOpen ? ' is-open' : ''}`}
      aria-label="메뉴 추천받기"
    >
      <div className="fridge-banner">
        <div className="fridge-banner__media" aria-hidden="true">
          <img
            className="fridge-banner__image fridge-banner__image--closed"
            src={bannerBefore}
            alt=""
          />
          <img
            className="fridge-banner__image fridge-banner__image--open"
            src={bannerAfter}
            alt=""
          />
        </div>

        <div className="fridge-banner__content">
          <h2>도락마켓 가기</h2>
          <p>
            부족한 재료부터 도시락템까지
            <br />
            오늘 필요한 것만 쏙 골라보세요
          </p>
        </div>
        <img className="fridge-banner__arrow" src={arrowIcon} alt="" aria-hidden="true" />
      </div>
      <span ref={triggerRef} className="fridge-banner__bottom-trigger" aria-hidden="true" />
    </section>
  )
}

export default HomeFridgeBanner

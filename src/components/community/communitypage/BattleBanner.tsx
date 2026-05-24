import { useEffect, useRef } from 'react'
import './BattleBanner.css'
import battleGroupImage from '../common/images/rank_banner.png'
import rewardIcon from '../common/images/point.png'

function BattleBanner() {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          btn.classList.add('is-expanded')
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -37% 0px' }
    )
    observer.observe(btn)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="battle-banner">
      <div className="battle-banner__header">
        <h2>다가올 도락 배틀</h2>
        <p>새로운 배틀이 찾아와요</p>
      </div>

      <div className="battle-banner__card">
        <img
          className="battle-banner__card-image"
          src={battleGroupImage}
          alt=""
          aria-hidden="true"
        />
        <div className="battle-banner__card-content">
          <div className="battle-banner__card-title">
            <p className="battle-banner__card-title-sub">냉장고 털어 만든</p>
            <p className="battle-banner__card-title-main">최고의 도시락</p>
          </div>
          <button ref={btnRef} type="button" className="battle-banner__card-btn">
            <span className="battle-banner__card-btn-text">바로 가기</span>
            <svg
              className="battle-banner__card-btn-icon"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3.84961 0.5L9.99961 6.65C10.0474 6.69489 10.0856 6.74911 10.1116 6.80931C10.1377 6.8695 10.1511 6.9344 10.1511 7C10.1511 7.0656 10.1377 7.1305 10.1116 7.19069C10.0856 7.25089 10.0474 7.30511 9.99961 7.35L3.84961 13.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="battle-banner__card-deadline">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            참여 마감 D-7
          </div>
        </div>
      </div>

      <div className="battle-banner__reward">
        <img
          className="battle-banner__reward-icon"
          src={rewardIcon}
          alt=""
          aria-hidden="true"
        />
        <div className="battle-banner__reward-text">
          <p className="battle-banner__reward-title">참여만 해도 50P!</p>
          <p className="battle-banner__reward-sub">상위 3명에게는 추가 포인트가 지급돼요.</p>
        </div>
      </div>
    </section>
  )
}

export default BattleBanner

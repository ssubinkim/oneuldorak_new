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
            <span className="battle-banner__card-btn-text">Coming soon..</span>
          </button>
          <p className="battle-banner__card-footer">이번 배틀도 기대해주세요!</p>
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

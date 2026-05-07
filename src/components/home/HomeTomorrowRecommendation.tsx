import { ChevronIcon } from './ChevronIcon'
import './HomeTomorrowRecommendation.css'

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 32" aria-hidden="true">
      <path d="M5 3h14v25l-7-4.7L5 28V3Z" />
    </svg>
  )
}

function HomeTomorrowRecommendation() {
  return (
    <section className="home-section" aria-labelledby="tomorrowTitle">
      <div className="section-title">
        <h2 id="tomorrowTitle">내일의 도시락 추천</h2>
        <a href="#more-lunch">
          더보기
          <ChevronIcon />
        </a>
      </div>

      <div className="recommend-stack">
        <article className="recommend-card-main">
          <span className="recommend-card-main__badge">-6,100 원</span>
          <span className="recommend-card-main__bookmark">
            <BookmarkIcon />
          </span>
          <div className="recommend-card-main__image" aria-hidden="true" />
          <h3>닭가슴살 밀프랩</h3>
          <p>⏱ 약 10분 · 보통</p>
        </article>
      </div>
    </section>
  )
}

export default HomeTomorrowRecommendation

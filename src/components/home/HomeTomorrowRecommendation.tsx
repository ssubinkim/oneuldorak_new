import './HomeTomorrowRecommendation.css'

function HomeTomorrowRecommendation() {
  return (
    <section className="tomorrow-section" aria-labelledby="tomorrowTitle">
      <div className="home-section-title">
        <h2 id="tomorrowTitle">내일 도시락 뭐 먹지 ?</h2>
        <a href="#more-lunch">더보기 〉</a>
      </div>

      <div className="tomorrow-carousel">
        <span className="tomorrow-carousel__side" aria-hidden="true" />
        <article className="tomorrow-card">
          <h3>닭가슴살 밀프랩</h3>
          <p className="tomorrow-card__price">-6,100 원</p>
          <div className="tomorrow-card__image" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>⏱ 약 10분 · 보통</p>
        </article>
        <span className="tomorrow-carousel__side" aria-hidden="true" />
      </div>

      <div className="home-dots" aria-hidden="true">
        <span className="home-dots__item home-dots__item--active" />
        <span className="home-dots__item" />
        <span className="home-dots__item" />
        <span className="home-dots__item" />
        <span className="home-dots__item" />
      </div>
    </section>
  )
}

export default HomeTomorrowRecommendation

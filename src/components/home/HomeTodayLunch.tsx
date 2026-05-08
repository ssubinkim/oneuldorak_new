import { ChevronIcon } from './ChevronIcon'
import './HomeTodayLunch.css'

function HomeTodayLunch() {
  return (
    <section className="today-section" aria-labelledby="todayLunchHeading">
      <article className="today-card">
        <div className="today-card__ribbon">Today</div>
        <h2 id="todayLunchHeading">닭가슴살 샐러드</h2>
        <div className="today-card__line" aria-hidden="true" />
        <p className="today-card__desc">
          신선한 채소와 닭가슴살로
          <br />
          가볍고 든든하게 !
        </p>
        <div className="today-card__tags" aria-label="추천 태그">
          <span>#든든</span>
          <span>#식이섬유</span>
          <span>#단백질</span>
        </div>
        <p className="today-card__price">
          <mark>6,800원</mark> 절약
        </p>
        <button className="today-card__button" type="button">
          바로가기
          <ChevronIcon />
        </button>
        <div className="today-card__image" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </article>
    </section>
  )
}

export default HomeTodayLunch

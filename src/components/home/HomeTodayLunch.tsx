import { ChevronIcon } from './ChevronIcon'
import './HomeTodayLunch.css'

function HomeTodayLunch() {
  return (
    <section className="today-card" aria-labelledby="todayLunchHeading">
      <div className="today-card__ribbon">오늘의 도시락</div>
      <p className="today-card__eyebrow">신선한 채소와 닭가슴살로 가볍고 든든하게!</p>
      <h2 id="todayLunchHeading">닭가슴살 샐러드</h2>
      <div className="today-card__tags" aria-label="추천 태그">
        <span>#저칼로리</span>
        <span>#단백질</span>
        <span>#식이섬유</span>
      </div>
      <div className="today-card__price">
        6,800원 <span>절약</span>
      </div>
      <button className="today-card__button" type="button">
        바로가기
        <ChevronIcon />
      </button>
      <div className="today-card__image" aria-hidden="true" />
    </section>
  )
}

export default HomeTodayLunch

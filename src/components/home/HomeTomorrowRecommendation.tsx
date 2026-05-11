import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import fridayMenuImage from '../../pages/meal/images/friday_menu.png'
import saturdayMenuImage from '../../pages/meal/images/saturday_menu.png'
import todayMenuImage from '../../pages/meal/images/today_menu.png'
import tuesdayMenuImage from '../../pages/meal/images/tuesday_menu.png'
import wednesdayMenuImage from '../../pages/meal/images/wednesday_menu.png'
import 'swiper/css'
import './HomeTomorrowRecommendation.css'

type TomorrowCard = {
  id: number
  title: string
  priceText: string
  image: string
  timeText: string
}

const tomorrowCards: TomorrowCard[] = [
  { id: 1, title: '닭가슴살 밀프랩', priceText: '-6,100 원', image: tuesdayMenuImage, timeText: '약 10분 · 보통' },
  { id: 2, title: '연어 샐러드', priceText: '-6,900 원', image: todayMenuImage, timeText: '약 12분 · 쉬움' },
  { id: 3, title: '계란 볶음밥', priceText: '-4,300 원', image: fridayMenuImage, timeText: '약 8분 · 쉬움' },
  { id: 4, title: '참치 주먹밥', priceText: '-3,800 원', image: wednesdayMenuImage, timeText: '약 9분 · 보통' },
  { id: 5, title: '김치 볶음밥', priceText: '-4,900 원', image: saturdayMenuImage, timeText: '약 11분 · 보통' },
]

function HomeTomorrowRecommendation() {
  const [activeCardIndex, setActiveCardIndex] = useState(2)

  return (
    <section className="tomorrow-section" aria-labelledby="tomorrowTitle">
      <div className="home-section-title">
        <h2 id="tomorrowTitle">내일 도시락 뭐 먹지 ?</h2>
        <a href="#more-lunch">더보기 〉</a>
      </div>

      <div className="tomorrow-section__deck">
        <Swiper
          className="tomorrow-swiper"
          slidesPerView="auto"
          centeredSlides
          grabCursor
          loop={tomorrowCards.length > 2}
          initialSlide={activeCardIndex}
          spaceBetween={-222}
          onAfterInit={(swiper) => {
            setActiveCardIndex(swiper.realIndex)
          }}
          onSlideChange={(swiper) => {
            setActiveCardIndex(swiper.realIndex)
          }}
        >
          {tomorrowCards.map((card) => (
            <SwiperSlide key={card.id} className="tomorrow-swiper__slide">
              <article className="tomorrow-card">
                <h3 className="tomorrow-card__title">{card.title}</h3>
                <p className="tomorrow-card__price">{card.priceText}</p>
                <img className="tomorrow-card__image" src={card.image} alt={card.title} />
                <div className="tomorrow-card__meta">
                  <svg className="tomorrow-card__clock-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 5.4v2.8l1.9 1.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{card.timeText}</span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="home-dots" aria-hidden="true">
        {tomorrowCards.map((card, index) => (
          <span
            key={card.id}
            className={`home-dots__item${index === activeCardIndex ? ' home-dots__item--active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HomeTomorrowRecommendation

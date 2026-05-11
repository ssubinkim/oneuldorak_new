import { useState } from 'react'
import FanDeck, { type FanDeckItem } from '../effects/cards/FanDeck'
import fridayMenuImage from '../meal/images/friday_menu.png'
import saturdayMenuImage from '../meal/images/saturday_menu.png'
import todayMenuImage from '../meal/images/today_menu.png'
import tuesdayMenuImage from '../meal/images/tuesday_menu.png'
import wednesdayMenuImage from '../meal/images/wednesday_menu.png'
import './HomeTomorrowRecommendation.css'

const tomorrowCards: FanDeckItem[] = [
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
        <FanDeck
          items={tomorrowCards}
          startIndex={activeCardIndex}
          layout="stack"
          cardOffsetX={58}
          onActiveIndexChange={setActiveCardIndex}
        />
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

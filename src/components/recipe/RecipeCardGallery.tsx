import { useState } from 'react'
import spamMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import heartIcon from '../../assets/icons/heart.svg'
import './RecipeCardGallery.css'

type GalleryCard = {
  id: string
  channel: string
  title: string
  price: string
  time: string
  difficulty: string
  likes: number
  saves: number
  comments: number
  image: string
}

const galleryCards: GalleryCard[] = [
  {
    id: 'gal-1',
    channel: '스팸 마요',
    title: '스팸 마요 덮밥',
    price: '5000원',
    time: '20분',
    difficulty: '초보',
    likes: 375,
    saves: 452,
    comments: 452,
    image: spamMayoImage,
  },
  {
    id: 'gal-2',
    channel: '깍두기',
    title: '깍두기 볶음밥',
    price: '5000원',
    time: '30분',
    difficulty: '초보',
    likes: 375,
    saves: 452,
    comments: 452,
    image: kimchiRiceImage,
  },
  {
    id: 'gal-3',
    channel: '비빔밥',
    title: '한 그릇 비빔밥',
    price: '5000원',
    time: '20분',
    difficulty: '보통',
    likes: 320,
    saves: 410,
    comments: 389,
    image: bibimbapImage,
  },
]

function RecipeCardGallery() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="recipe-gallery-section" aria-labelledby="galleryRecipeTitle">
      <div className="recipe-gallery-section__header">
        <h2 id="galleryRecipeTitle">이번주 추천레시피</h2>
      </div>

      <div className="recipe-gallery-scroll" role="list">
        {galleryCards.map((card, index) => (
          <article
            key={card.id}
            className={`recipe-gallery-card${index === activeIndex ? ' recipe-gallery-card--active' : ''}`}
            role="listitem"
            onClick={() => setActiveIndex(index)}
          >
            <img className="recipe-gallery-card__image" src={card.image} alt={card.title} />
            <div className="recipe-gallery-card__overlay">
              <div className="recipe-gallery-card__bottom">
                <div className="recipe-gallery-card__info">
                  <p className="recipe-gallery-card__channel">{card.channel}</p>
                  <h3 className="recipe-gallery-card__title">{card.title}</h3>
                  <div className="recipe-gallery-card__meta">
                    <span>{card.price}</span>
                    <span>{card.time}</span>
                    <span>{card.difficulty}</span>
                  </div>
                </div>
                <span className="recipe-gallery-card__likes">
                  <img src={heartIcon} alt="" aria-hidden="true" />
                  {card.likes}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="recipe-gallery-dots" aria-hidden="true">
        {galleryCards.map((card, index) => (
          <span
            key={card.id}
            className={`recipe-gallery-dot${index === activeIndex ? ' recipe-gallery-dot--active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}

export default RecipeCardGallery

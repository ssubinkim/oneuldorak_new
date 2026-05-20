import { useState, useRef, useCallback, useEffect } from 'react'
import topic1Image from './images/topic_1.png'
import topic2Image from './images/topic_2.png'
import topic3Image from './images/topic_3.png'
import topic4Image from './images/topic_4.png'
import food1Image from './images/food_1.png'
import food2Image from './images/food_2.png'
import food3Image from './images/food_3.png'
import food7Image from './images/food_7.png'
import food8Image from './images/food_8.png'
import food9Image from './images/food_9.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import spamMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import bulgogi from '../../assets/images/food_imges/bulgogi.png'
import noodles from '../../assets/images/food_imges/noodles.jpg'
import './RecipeWeeklySection.css'

type FoodItem = {
  id: string
  name: string
  likes: number
  image: string
  recipeId: string
}

type Topic = {
  id: string
  theme: string
  views: number
  comments: number
  likes: number
  heroImage: string
  foods: FoodItem[]
  recipeId: string
}

const topics: Topic[] = [
  {
    id: 'picnic',
    theme: '오늘은 피크닉 느낌을 느껴볼까?\n피크닉 무드 레시피 TOP4',
    views: 88, comments: 12, likes: 452,
    heroImage: topic1Image, recipeId: 'recipe-1',
    foods: [
      { id: 'p1', name: '달콤알싸 훈제연어 샌드위치', likes: 452, image: food1Image, recipeId: 'recipe-1' },
      { id: 'p2', name: '크로와상 에그 샐러드', likes: 320, image: food2Image, recipeId: 'recipe-2' },
      { id: 'p3', name: '과일 꼬치 & 요거트 딥', likes: 218, image: food3Image, recipeId: 'recipe-3' },
    ],
  },
  {
    id: 'home-cooking',
    theme: '집밥처럼 든든한\n도시락 레시피 TOP4',
    views: 74, comments: 9, likes: 380,
    heroImage: topic2Image, recipeId: 'recipe-2',
    foods: [
      { id: 'h1', name: '김치볶음밥 도시락', likes: 380, image: kimchiRiceImage, recipeId: 'recipe-1' },
      { id: 'h2', name: '참치 마요 주먹밥', likes: 295, image: spamMayoImage, recipeId: 'recipe-2' },
      { id: 'h3', name: '한 그릇 비빔밥', likes: 241, image: bibimbapImage, recipeId: 'recipe-3' },
    ],
  },
  {
    id: 'diet',
    theme: '건강하게 먹고 싶은 날\n다이어트 레시피 TOP4',
    views: 65, comments: 8, likes: 310,
    heroImage: topic3Image, recipeId: 'recipe-3',
    foods: [
      { id: 'd1', name: '닭가슴살 샐러드 볼', likes: 310, image: food7Image, recipeId: 'recipe-1' },
      { id: 'd2', name: '두부 샐러드 도시락', likes: 228, image: food8Image, recipeId: 'recipe-2' },
      { id: 'd3', name: '채소 쌈밥 세트', likes: 195, image: food9Image, recipeId: 'recipe-3' },
    ],
  },
  {
    id: 'night',
    theme: '정성 가득 하루를 담은\n도시락 레시피 TOP4',
    views: 92, comments: 15, likes: 512,
    heroImage: topic4Image, recipeId: 'recipe-1',
    foods: [
      { id: 'n1', name: '불고기 덮밥', likes: 512, image: bulgogi, recipeId: 'recipe-1' },
      { id: 'n2', name: '잔치국수', likes: 387, image: noodles, recipeId: 'recipe-2' },
      { id: 'n3', name: '참치 마요 덮밥', likes: 290, image: spamMayoImage, recipeId: 'recipe-3' },
    ],
  },
]

// ── FoodBannerCard ──────────────────────────────────────────────
function FoodBannerCard({ food, onOpenDetail }: { food: FoodItem; onOpenDetail: (id: string) => void }) {
  return (
    <article className="food-banner-card" onClick={() => onOpenDetail(food.recipeId)} style={{ cursor: 'pointer' }}>
      <img className="food-banner-card__thumbnail" src={food.image} alt={food.name} />
      <div className="food-banner-card__info">
        <p className="food-banner-card__name">{food.name}</p>
        <span className="food-banner-card__likes">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314Z" />
          </svg>
          {food.likes}
        </span>
      </div>
    </article>
  )
}

// ── FoodBannerSlider (inner nested slider) ──────────────────────
function FoodBannerSlider({ foods, onOpenDetail }: { foods: FoodItem[]; onOpenDetail: (id: string) => void }) {
  return (
    <div className="food-banner-slider">
      <div className="food-banner-track">
        {foods.map((food) => (
          <FoodBannerCard key={food.id} food={food} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  )
}

// ── TopicCard ───────────────────────────────────────────────────
function TopicCard({ topic, isActive, onOpenDetail }: { topic: Topic; isActive: boolean; onOpenDetail: (id: string) => void }) {
  return (
    <div className={`topic-card${isActive ? ' topic-card--active' : ''}`} onClick={() => onOpenDetail(topic.recipeId)} style={{ cursor: 'pointer' }}>
      <img className="topic-card__hero" src={topic.heroImage} alt="" />
      <div className="topic-card__overlay">
        <div className="topic-card__header">
          <p className="topic-card__theme">{topic.theme}</p>
          <div className="topic-card__stats">
            <span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
              </svg>
              {topic.views}
            </span>
            <span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .854.354L5 10.707V12.5a.5.5 0 0 0 .854.354L8.207 10.5H11a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H2.5ZM1 3.5A1.5 1.5 0 0 1 2.5 2h8.5A1.5 1.5 0 0 1 12.5 3.5v7A1.5 1.5 0 0 1 11 12H8.5l-2.5 2.5V12H2.5A1.5 1.5 0 0 1 1 10.5v-7Z" />
              </svg>
              {topic.comments}
            </span>
            <span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M5.28498 9.03804C5.12915 9.09304 4.87248 9.09304 4.71665 9.03804C3.38748 8.58429 0.41748 6.69138 0.41748 3.48304C0.41748 2.06679 1.55873 0.920959 2.96581 0.920959C3.79998 0.920959 4.5379 1.32429 5.00081 1.94763C5.46373 1.32429 6.20623 0.920959 7.03581 0.920959C8.4429 0.920959 9.58415 2.06679 9.58415 3.48304C9.58415 6.69138 6.61415 8.58429 5.28498 9.03804Z" stroke="#E70012" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {topic.likes}
            </span>
          </div>
        </div>
        <FoodBannerSlider foods={topic.foods} onOpenDetail={onOpenDetail} />
      </div>
    </div>
  )
}

// ── RecipeWeeklySection (outer slider) ─────────────────────────
function RecipeWeeklySection({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    const firstCard = el.querySelector<HTMLElement>('.topic-card')
    if (!firstCard) return
    const cardWidth = firstCard.offsetWidth
    const gap = 16
    const index = Math.round(el.scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.max(0, Math.min(index, topics.length - 1)))
  }, [])

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section className="recipe-weekly-section" aria-labelledby="weeklyRecipeTitle">
      <div className="recipe-weekly-section__header">
        <h2 id="weeklyRecipeTitle" className="recipe-weekly-section__title">이번주 추천레시피</h2>
      </div>

      <div className="topic-slider" ref={sliderRef}>
        {topics.map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} isActive={index === activeIndex} onOpenDetail={onOpenDetail} />
        ))}
      </div>

      <div className="topic-dots" aria-hidden="true">
        {topics.map((topic, index) => (
          <span
            key={topic.id}
            className={`topic-dot${index === activeIndex ? ' topic-dot--active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}

export default RecipeWeeklySection

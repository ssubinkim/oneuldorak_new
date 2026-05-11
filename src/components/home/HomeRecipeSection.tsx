import { useState } from 'react'
import CoverflowSwiper, { type CoverflowSlideItem } from '../effects/swiper/CoverFlow'
import fridayMenuImage from '../../pages/meal/images/friday_menu.png'
import saladRecipeImage from '../../pages/meal/images/recipe1.png'
import saturdayMenuImage from '../../pages/meal/images/saturday_menu.png'
import tuesdayMenuImage from '../../pages/meal/images/tuesday_menu.png'
import wednesdayMenuImage from '../../pages/meal/images/wednesday_menu.png'
import './HomeRecipeSection.css'

const recipes: CoverflowSlideItem[] = [
  {
    id: 'recipe-1',
    image: saladRecipeImage,
    title: '샐러드',
    likes: 36,
    views: 13,
  },
  {
    id: 'recipe-2',
    image: fridayMenuImage,
    title: '계란 볶음밥',
    likes: 42,
    views: 17,
  },
  {
    id: 'recipe-3',
    image: tuesdayMenuImage,
    title: '그릴드 치킨 샐러드',
    likes: 31,
    views: 11,
  },
  {
    id: 'recipe-4',
    image: wednesdayMenuImage,
    title: '주먹밥 도시락',
    likes: 28,
    views: 9,
  },
  {
    id: 'recipe-5',
    image: saturdayMenuImage,
    title: '김치 볶음밥',
    likes: 55,
    views: 21,
  },
]

function HomeRecipeSection() {
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(1)

  return (
    <section className="recipe-section" aria-labelledby="recipeTitle">
      <div className="home-section-title recipe-section__title">
        <div>
          <h2 id="recipeTitle">이 레시피 어때요?</h2>
          <p>제일 많이 본 인기있는 레시피 모음</p>
        </div>
        <a href="#more-recipes">더보기 〉</a>
      </div>
      <div className="recipe-section__carousel">
        <CoverflowSwiper
          className="recipe-section__coverflow"
          items={recipes}
          initialSlide={activeRecipeIndex}
          effectMode="slide"
          spaceBetween={14}
          autoplay
          autoplayDelayMs={2000}
          onActiveIndexChange={setActiveRecipeIndex}
        />
      </div>
      <div className="home-dots recipe-section__dots" aria-hidden="true">
        {recipes.map((recipe, index) => (
          <span
            key={recipe.id}
            className={`home-dots__item${index === activeRecipeIndex ? ' home-dots__item--active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HomeRecipeSection

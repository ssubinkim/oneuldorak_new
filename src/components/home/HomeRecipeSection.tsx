import { useState } from 'react'
import CoverflowSwiper, { type CoverflowSlideItem } from '../effects/swiper/CoverFlow'
import fridayMenuImage from '../../pages/meal/images/friday_menu.png'
import saturdayMenuImage from '../../pages/meal/images/saturday_menu.png'
import todayMenuImage from '../../pages/meal/images/today_menu.png'
import tuesdayMenuImage from '../../pages/meal/images/tuesday_menu.png'
import wednesdayMenuImage from '../../pages/meal/images/wednesday_menu.png'
import './HomeRecipeSection.css'

const recipes: CoverflowSlideItem[] = [
  {
    id: 'recipe-1',
    image: todayMenuImage,
    title: '연어 샐러드',
    likes: 36,
    comments: 13,
  },
  {
    id: 'recipe-2',
    image: fridayMenuImage,
    title: '계란 볶음밥',
    likes: 42,
    comments: 17,
  },
  {
    id: 'recipe-3',
    image: tuesdayMenuImage,
    title: '그릴드 치킨 샐러드',
    likes: 31,
    comments: 11,
  },
  {
    id: 'recipe-4',
    image: wednesdayMenuImage,
    title: '주먹밥 도시락',
    likes: 28,
    comments: 9,
  },
  {
    id: 'recipe-5',
    image: saturdayMenuImage,
    title: '김치 볶음밥',
    likes: 55,
    comments: 21,
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

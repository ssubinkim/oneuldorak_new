import { useEffect, useRef } from 'react'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import spamMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import bulgogi from '../../assets/images/food_imges/bulgogi.png'
import omurice from '../../assets/images/food_imges/omurice.png'
import './RecipePopularList.css'

type PopularRecipe = {
  id: string
  rank: number
  description: string
  title: string
  tags: { label: string; color: 'red' | 'orange' | 'green' }[]
  likes: number
  comments: number
  saves: number
  thumbnail: string
  recipeId: string
}

const popularRecipes: PopularRecipe[] = [
  {
    id: 'pop-1',
    rank: 1,
    description: '저렴한 재료로 든든하게',
    title: '냉장고 재료로 완성하는 3천원 도시락',
    tags: [
      { label: '3000원', color: 'red' },
      { label: '15분', color: 'orange' },
      { label: '쉬움', color: 'green' },
    ],
    likes: 88,
    comments: 12,
    saves: 24,
    thumbnail: kimchiRiceImage,
    recipeId: 'recipe-1',
  },
  {
    id: 'pop-2',
    rank: 2,
    description: '저렴한 재료로 든든하게',
    title: '부담 없는 재료로 든든하게 한 끼',
    tags: [
      { label: '3000원', color: 'red' },
      { label: '15분', color: 'orange' },
      { label: '쉬움', color: 'green' },
    ],
    likes: 88,
    comments: 12,
    saves: 24,
    thumbnail: spamMayoImage,
    recipeId: 'recipe-2',
  },
  {
    id: 'pop-3',
    rank: 3,
    description: '저렴한 재료로 든든하게',
    title: '간단한 재료로 만드는 초간단 도시락',
    tags: [
      { label: '3000원', color: 'red' },
      { label: '15분', color: 'orange' },
      { label: '쉬움', color: 'green' },
    ],
    likes: 88,
    comments: 12,
    saves: 24,
    thumbnail: bibimbapImage,
    recipeId: 'recipe-3',
  },
  {
    id: 'pop-4',
    rank: 4,
    description: '저렴한 재료로 든든하게',
    title: '10분이면 완성되는 가성비 도시락 레시피',
    tags: [
      { label: '3000원', color: 'red' },
      { label: '15분', color: 'orange' },
      { label: '쉬움', color: 'green' },
    ],
    likes: 88,
    comments: 12,
    saves: 24,
    thumbnail: bulgogi,
    recipeId: 'recipe-1',
  },
  {
    id: 'pop-5',
    rank: 5,
    description: '저렴한 재료로 든든하게',
    title: '집에 있는 재료로 맛있게 채우는 한 끼',
    tags: [
      { label: '3000원', color: 'red' },
      { label: '15분', color: 'orange' },
      { label: '쉬움', color: 'green' },
    ],
    likes: 88,
    comments: 12,
    saves: 24,
    thumbnail: omurice,
    recipeId: 'recipe-2',
  },
]

const rankColors: Record<number, string> = {
  1: '#f5a623',
  2: '#9b9b9b',
  3: '#b87333',
}

function PopularRecipeItem({ recipe, onOpenDetail }: { recipe: PopularRecipe; onOpenDetail: (id: string) => void }) {
  const rankColor = rankColors[recipe.rank]

  return (
    <li className="recipe-popular-item">
      <button className="recipe-popular-item__btn" type="button" aria-label={recipe.title} onClick={() => onOpenDetail(recipe.recipeId)}>
        <span
          className="recipe-popular-item__rank"
          style={rankColor ? { color: rankColor } : undefined}
        >
          {recipe.rank}
        </span>
        <div className="recipe-popular-item__thumbnail-wrap">
          <img className="recipe-popular-item__thumbnail" src={recipe.thumbnail} alt={recipe.title} />
          {recipe.rank <= 3 && (
            <span className="recipe-popular-item__badge" style={{ background: rankColor }}>
              TOP{recipe.rank}
            </span>
          )}
        </div>
        <div className="recipe-popular-item__content">
          <p className="recipe-popular-item__desc">{recipe.description}</p>
          <h3 className="recipe-popular-item__title">{recipe.title}</h3>
          <div className="recipe-popular-item__tags">
            {recipe.tags.map((tag) => (
              <span key={tag.label} className={`recipe-popular-tag recipe-popular-tag--${tag.color}`}>
                {tag.label}
              </span>
            ))}
          </div>
          <div className="recipe-popular-item__stats">
            <span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M5.28498 9.03804C5.12915 9.09304 4.87248 9.09304 4.71665 9.03804C3.38748 8.58429 0.41748 6.69138 0.41748 3.48304C0.41748 2.06679 1.55873 0.920959 2.96581 0.920959C3.79998 0.920959 4.5379 1.32429 5.00081 1.94763C5.46373 1.32429 6.20623 0.920959 7.03581 0.920959C8.4429 0.920959 9.58415 2.06679 9.58415 3.48304C9.58415 6.69138 6.61415 8.58429 5.28498 9.03804Z" stroke="#E70012" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {recipe.likes}
            </span>
            <span>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: '10px', height: '10px' }}>
                <path d="M4.5 12.5L0.5 13.5L1.5 10.5V1.5C1.5 1.23478 1.60536 0.98043 1.79289 0.792893C1.98043 0.605357 2.23478 0.5 2.5 0.5H12.5C12.7652 0.5 13.0196 0.605357 13.2071 0.792893C13.3946 0.98043 13.5 1.23478 13.5 1.5V11.5C13.5 11.7652 13.3946 12.0196 13.2071 12.2071C13.0196 12.3946 12.7652 12.5 12.5 12.5H4.5Z" />
              </svg>
              {recipe.comments}
            </span>
            <span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              {recipe.saves}
            </span>
          </div>
        </div>
      </button>
    </li>
  )
}

function RecipePopularList({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          list.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="recipe-popular-section" aria-labelledby="popularRecipeTitle">
      <div className="recipe-popular-section__header">
        <h2 id="popularRecipeTitle">인기 레시피</h2>
      </div>
      <ol className="recipe-popular-list" ref={listRef}>
        {popularRecipes.map((recipe) => (
          <PopularRecipeItem key={recipe.id} recipe={recipe} onOpenDetail={onOpenDetail} />
        ))}
      </ol>
    </section>
  )
}

export default RecipePopularList

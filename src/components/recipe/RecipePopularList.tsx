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
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314Z" /></svg>
              {recipe.likes}
            </span>
            <span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .854.354L5 10.707V12.5a.5.5 0 0 0 .854.354L8.207 10.5H11a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H2.5ZM1 3.5A1.5 1.5 0 0 1 2.5 2h8.5A1.5 1.5 0 0 1 12.5 3.5v7A1.5 1.5 0 0 1 11 12H8.5l-2.5 2.5V12H2.5A1.5 1.5 0 0 1 1 10.5v-7Z" /></svg>
              {recipe.comments}
            </span>
            <span>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1Z" /></svg>
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

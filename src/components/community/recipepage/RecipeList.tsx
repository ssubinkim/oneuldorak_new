import './RecipeList.css'
import recipeThumbImage from './images/menu_1 (1).png'

export type RecipeItem = {
  id: string
  title: string
  subtitle: string
  price: string
  time: string
  level: string
  author: string
  likes: number
  comments: number
  saves: number
  image?: string
}

type RecipeListProps = {
  onOpenDetail: (recipeId: string) => void
  extraItems?: RecipeItem[]
}

const recipeItems: RecipeItem[] = [
  {
    id: 'recipe-1',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    author: '절약왕',
    likes: 88,
    comments: 12,
    saves: 24,
    image: recipeThumbImage,
  },
  {
    id: 'recipe-2',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    author: '절약왕',
    likes: 88,
    comments: 12,
    saves: 24,
    image: recipeThumbImage,
  },
  {
    id: 'recipe-3',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    author: '절약왕',
    likes: 88,
    comments: 12,
    saves: 24,
    image: recipeThumbImage,
  },
  {
    id: 'recipe-4',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    author: '절약왕',
    likes: 88,
    comments: 12,
    saves: 24,
    image: recipeThumbImage,
  },
  {
    id: 'recipe-5',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    author: '절약왕',
    likes: 88,
    comments: 12,
    saves: 24,
    image: recipeThumbImage,
  },
  {
    id: 'recipe-6',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    author: '절약왕',
    likes: 88,
    comments: 12,
    saves: 24,
    image: recipeThumbImage,
  },
]

function RecipeActionIcon({ kind }: { kind: 'heart' | 'comment' | 'bookmark' }) {
  if (kind === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  if (kind === 'comment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
    </svg>
  )
}

function RecipeCard({
  item,
  onOpenDetail,
}: {
  item: RecipeItem
  onOpenDetail: (recipeId: string) => void
}) {
  const handleOpenDetail = () => {
    onOpenDetail(item.id)
  }

  return (
    <article
      className="recipe-share-card"
      role="button"
      tabIndex={0}
      onClick={handleOpenDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleOpenDetail()
        }
      }}
    >
      <img className="recipe-share-card__thumb" src={item.image ?? recipeThumbImage} alt="" aria-hidden="true" />

      <div className="recipe-share-card__content">
        <p className="recipe-share-card__subtitle">{item.subtitle}</p>
        <h2 className="recipe-share-card__title">{item.title}</h2>

        <div className="recipe-share-card__badges">
          <span className="is-price">{item.price}</span>
          <span>{item.time}</span>
          <span>{item.level}</span>
        </div>

        <div className="recipe-share-card__meta-row">
          <small>
            <span aria-hidden="true">🐥</span>
            {item.author}
          </small>
          <div className="recipe-share-card__actions" aria-label="반응 통계">
            <div>
              <RecipeActionIcon kind="heart" />
              {item.likes}
            </div>
            <div>
              <RecipeActionIcon kind="comment" />
              {item.comments}
            </div>
            <div>
              <RecipeActionIcon kind="bookmark" />
              {item.saves}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function RecipeList({ onOpenDetail, extraItems = [] }: RecipeListProps) {
  const items = [...extraItems, ...recipeItems]

  return (
    <section className="recipe-page__list" aria-label="레시피 목록">
      {items.map((item) => (
        <RecipeCard
          key={item.id}
          item={item}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </section>
  )
}

export default RecipeList

import './RecipeList.css'

type RecipeItem = {
  id: string
  title: string
  subtitle: string
  price: string
  time: string
  level: string
  tag: string
  likes: number
  comments: number
  highlight?: boolean
}

type RecipeListProps = {
  onOpenDetail: (recipeId: string) => void
}

const recipeItems: RecipeItem[] = [
  {
    id: 'recipe-1',
    title: '3000원으로 만드는 도시락',
    subtitle: '저렴한 재료로 든든하게',
    price: '3,000원',
    time: '15분',
    level: '쉬움',
    tag: '절약왕',
    likes: 156,
    comments: 42,
    highlight: true,
  },
  {
    id: 'recipe-2',
    title: '냉동실 파먹기 레시피',
    subtitle: '냉동 야채로 만드는 볶음밥',
    price: '2,500원',
    time: '10분',
    level: '쉬움',
    tag: '알뜰이',
    likes: 89,
    comments: 23,
  },
  {
    id: 'recipe-3',
    title: '5분 완성 간단 볶음밥',
    subtitle: '간단하고 맛있는 볶음밥',
    price: '4,000원',
    time: '5분',
    level: '쉬움',
    tag: '요리초보',
    likes: 234,
    comments: 67,
    highlight: true,
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
      <div className="recipe-share-card__thumb" aria-hidden="true">
        썸네일
      </div>

      <div className="recipe-share-card__content">
        <div className="recipe-share-card__title-row">
          <h2>{item.title}</h2>
          {item.highlight && <span>↗</span>}
        </div>
        <p className="recipe-share-card__subtitle">{item.subtitle}</p>

        <div className="recipe-share-card__badges">
          <span className="is-price">{item.price}</span>
          <span>{item.time}</span>
          <span>{item.level}</span>
        </div>

        <div className="recipe-share-card__meta-row">
          <small>{item.tag}</small>
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
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function RecipeList({ onOpenDetail }: RecipeListProps) {
  return (
    <section className="recipe-page__list" aria-label="레시피 목록">
      {recipeItems.map((item) => (
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

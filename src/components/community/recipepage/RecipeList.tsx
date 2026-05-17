import './RecipeList.css'
import { Fragment, type ReactNode, useEffect, useRef } from 'react'
import chamchimayoImage from '../../../assets/images/food_imges/chamchimayo.png'
import bibimbapImage from '../../../assets/images/food_imges/bibimbap.png'
import kimbokImage from '../../../assets/images/food_imges/kimbok.png'
import omuriceImage from '../../../assets/images/food_imges/omurice.png'
import bulgogiImage from '../../../assets/images/food_imges/bulgogi.png'
import ssoyaImage from '../../../assets/images/food_imges/ssoya.png'
import type { CommunityMediaAttachment } from '../communitywritepage/writeTypes'

export type RecipeItem = {
  id: string
  title: string
  subtitle: string
  content?: string
  price: string
  time: string
  level: string
  ingredient?: string
  tools?: string[]
  author: string
  authorId?: string
  likes: number
  comments: number
  saves: number
  image?: string
  media?: CommunityMediaAttachment[]
}

type RecipeListProps = {
  onOpenDetail: (recipeId: string) => void
  extraItems?: RecipeItem[]
  middleSlot?: ReactNode
  focusRecipeId?: string | null
  onFocusHandled?: () => void
}

const recipeItems: RecipeItem[] = [
  {
    id: 'recipe-1',
    title: '참치마요 덮밥',
    subtitle: 'chamchimayo',
    price: '3,500원',
    time: '10분',
    level: '쉬움',
    author: '한끼도락',
    likes: 124,
    comments: 19,
    saves: 41,
    image: chamchimayoImage,
  },
  {
    id: 'recipe-2',
    title: '비빔밥',
    subtitle: 'bibimbap',
    price: '4,500원',
    time: '18분',
    level: '쉬움',
    author: '집밥메이트',
    likes: 108,
    comments: 15,
    saves: 37,
    image: bibimbapImage,
  },
  {
    id: 'recipe-3',
    title: '김치볶음밥',
    subtitle: 'kimbok',
    price: '3,800원',
    time: '12분',
    level: '쉬움',
    author: '볶음밥연구소',
    likes: 132,
    comments: 21,
    saves: 45,
    image: kimbokImage,
  },
  {
    id: 'recipe-4',
    title: '오므라이스',
    subtitle: 'omurice',
    price: '4,200원',
    time: '20분',
    level: '쉬움',
    author: '계란한판',
    likes: 97,
    comments: 11,
    saves: 33,
    image: omuriceImage,
  },
  {
    id: 'recipe-5',
    title: '불고기 덮밥',
    subtitle: 'bulgogi',
    price: '5,000원',
    time: '25분',
    level: '보통',
    author: '고기좋아',
    likes: 143,
    comments: 26,
    saves: 52,
    image: bulgogiImage,
  },
  {
    id: 'recipe-6',
    title: '쏘야볶음',
    subtitle: 'ssoya',
    price: '4,000원',
    time: '14분',
    level: '쉬움',
    author: '도시락천재',
    likes: 111,
    comments: 18,
    saves: 39,
    image: ssoyaImage,
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
      data-recipe-id={item.id}
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
      <img className="recipe-share-card__thumb" src={item.image ?? chamchimayoImage} alt="" aria-hidden="true" />

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

function RecipeList({
  onOpenDetail,
  extraItems = [],
  middleSlot,
  focusRecipeId = null,
  onFocusHandled,
}: RecipeListProps) {
  const listRef = useRef<HTMLElement | null>(null)
  const items = [...extraItems, ...recipeItems]
  const middleInsertIndex = extraItems.length + Math.ceil(recipeItems.length / 2)
  const hasFocusTarget = focusRecipeId ? items.some((item) => item.id === focusRecipeId) : false

  useEffect(() => {
    if (!focusRecipeId || !hasFocusTarget) {
      return
    }

    const targetCard = listRef.current?.querySelector<HTMLElement>(`[data-recipe-id="${focusRecipeId}"]`)

    if (!targetCard) {
      return
    }

    targetCard.classList.add('is-newly-created')
    targetCard.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    onFocusHandled?.()

    const highlightTimer = window.setTimeout(() => {
      targetCard.classList.remove('is-newly-created')
    }, 1700)

    return () => window.clearTimeout(highlightTimer)
  }, [focusRecipeId, hasFocusTarget, onFocusHandled])

  return (
    <section ref={listRef} className="recipe-page__list" aria-label="레시피 목록">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <RecipeCard item={item} onOpenDetail={onOpenDetail} />
          {middleSlot && index === middleInsertIndex - 1 ? middleSlot : null}
        </Fragment>
      ))}
    </section>
  )
}

export default RecipeList

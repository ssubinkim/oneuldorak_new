import type { KeyboardEvent } from 'react'
import { openMypageCardTarget } from '../mypageNavigation'
import type { LikeRecipe } from './likePageData'
import './LikeRecipeCard.css'

type Props = { recipe: LikeRecipe }

export default function LikeRecipeCard({ recipe }: Props) {
  const isClickable = Boolean(recipe.target)

  const handleOpen = () => openMypageCardTarget(recipe.target)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleOpen()
    }
  }

  return (
    <div
      className={`lr-card${isClickable ? ' is-clickable' : ''}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleOpen : undefined}
      onKeyDown={handleKeyDown}
    >
      <img src={recipe.image} alt={recipe.title} className="lr-card-img" />
      <div className="lr-card-body">
        <p className="lr-card-desc">{recipe.description}</p>
        <p className="lr-card-title">{recipe.title}</p>
        <div className="lr-card-tags">
          <span className="lr-card-tag lr-card-tag--price">{recipe.price}</span>
          <span className="lr-card-tag">{recipe.time}</span>
          <span className="lr-card-tag">{recipe.difficulty}</span>
        </div>
        <p className="lr-card-date">{recipe.savedAt}</p>
      </div>
      <button
        className="lr-card-heart"
        aria-label="좋아요 취소"
        onClick={(e) => { e.stopPropagation(); handleOpen() }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef5246">
          <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
        </svg>
      </button>
    </div>
  )
}

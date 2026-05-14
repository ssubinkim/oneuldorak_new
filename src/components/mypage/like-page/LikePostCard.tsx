import type { KeyboardEvent } from 'react'
import { openMypageCardTarget, type MypageCardTarget } from '../mypageNavigation'
import './LikePostCard.css'

export type LikePost = {
  id: number | string
  category: string
  showIcon: boolean
  title: string
  savedAt: string
  target?: MypageCardTarget
}

type Props = { post: LikePost }

export default function LikePostCard({ post }: Props) {
  const isClickable = Boolean(post.target)

  const handleOpenPost = () => {
    openMypageCardTarget(post.target)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenPost()
    }
  }

  return (
    <div
      className={`like-card${isClickable ? ' is-clickable' : ''}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleOpenPost : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="like-card-top">
        <div className="like-card-left">
          <span className="like-card-badge">{post.category}</span>
          {post.showIcon && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="1,11 5,7 9,9 15,3" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="11,3 15,3 15,7" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <button
          className="like-card-heart"
          aria-label="좋아요 취소"
          onClick={handleOpenPost}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef5246" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
          </svg>
        </button>
      </div>
      <div className="like-card-title">{post.title}</div>
      <div className="like-card-date">{post.savedAt}</div>
    </div>
  )
}

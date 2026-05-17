import type { KeyboardEvent } from 'react'
import { openMypageCardTarget, type MypageCardTarget } from '../mypageNavigation'
import './LikePostCard.css'

export type LikePost = {
  id: number | string
  category: string
  showIcon?: boolean
  title: string
  preview?: string
  savedAt: string
  target?: MypageCardTarget
}

type Props = { post: LikePost }

export default function LikePostCard({ post }: Props) {
  const isClickable = Boolean(post.target)

  const handleOpen = () => openMypageCardTarget(post.target)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleOpen()
    }
  }

  return (
    <div
      className={`lp-card${isClickable ? ' is-clickable' : ''}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleOpen : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="lp-card-top">
        <span className="lp-card-badge">{post.category}</span>
        <button className="lp-card-heart" aria-label="좋아요 취소" onClick={(e) => { e.stopPropagation(); handleOpen() }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef5246">
            <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" />
          </svg>
        </button>
      </div>
      <div className="lp-card-title">{post.title}</div>
      {post.preview && <div className="lp-card-preview">{post.preview}</div>}
      <div className="lp-card-date">{post.savedAt}</div>
    </div>
  )
}

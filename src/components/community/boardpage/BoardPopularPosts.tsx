import React, { useState } from 'react'
import trophyIcon from '../../../assets/icons/trophy.svg'
import messageIcon from '../../../assets/icons/message-square.svg'
import './BoardPopularPosts.css'

export type BoardPopularPost = {
  id: string
  rank: number
  title: string
  body: string
  author: string
  mascot?: string
  likes: number
  comments: number
}

type BoardPopularPostsProps = {
  posts: BoardPopularPost[]
  onOpenDetail: (postId: string) => void
}

function PopularPostItem({ post, onOpenDetail }: { post: BoardPopularPost; onOpenDetail: (postId: string) => void }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = (event: React.MouseEvent) => {
    event.stopPropagation()
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1)
  }

  return (
    <li
      className={post.rank === 1 ? 'is-top' : undefined}
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(post.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDetail(post.id) } }}
    >
      <span className="board-popular-posts__rank">{post.rank}</span>
      <div>
        <strong>{post.title}</strong>
        <p className="board-popular-posts__body">{post.body}</p>
        <div className="board-popular-posts__footer">
          <span className="free-post-card__meta">
            {post.mascot && <img src={post.mascot} alt="" aria-hidden="true" />}
            {post.author}
          </span>
          <div className="board-popular-posts__stats">
            <button
              type="button"
              className={`board-popular-posts__like-btn${liked ? ' is-liked' : ''}`}
              onClick={handleLike}
              aria-label={liked ? '좋아요 취소' : '좋아요'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: liked ? '#ff5a5f' : 'none', stroke: 'currentColor' }}>
                <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
              </svg>
              {likeCount}
            </button>
            <span className="board-popular-posts__stat">
              <img src={messageIcon} alt="" aria-hidden="true" />
              {post.comments}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

function BoardPopularPosts({ posts, onOpenDetail }: BoardPopularPostsProps) {
  return (
    <section className="board-popular-posts" aria-label="실시간 인기글">
      <h2><img src={trophyIcon} alt="" aria-hidden="true" width={25} style={{ height: 'auto' }} />주간 인기글 TOP3</h2>

      <ol className="board-popular-posts__list">
        {posts.map((post) => (
          <PopularPostItem key={post.rank} post={post} onOpenDetail={onOpenDetail} />
        ))}
      </ol>
    </section>
  )
}

export default BoardPopularPosts

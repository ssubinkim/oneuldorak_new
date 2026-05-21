import './BoardList.css'
import React, { useEffect, useRef, useState } from 'react'
import { boardFilters, type BoardFilter } from './boardCategoryFilterData'
import { mockBoardPosts } from '../common/boardMockData'

export type BoardPost = {
  id: string
  category: string
  title: string
  body: string
  user: string
  authorId?: string
  mascot?: string
  timeAgo: string
  likes: number
  comments: number
  highlighted?: boolean
}

type BoardListProps = {
  activeFilter: BoardFilter
  onOpenDetail: (postId: string) => void
  extraPosts?: BoardPost[]
  focusPostId?: string | null
  onFocusHandled?: () => void
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: filled ? '#ff5a5f' : 'none', stroke: 'currentColor' }}>
      <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
    </svg>
  )
}

function BoardActionIcon({ kind }: { kind: 'comment' | 'bookmark' }) {
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

function BoardCard({
  post,
  onOpenDetail,
}: {
  post: BoardPost
  onOpenDetail: (postId: string) => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.classList.add('is-visible')
          observer.unobserve(card)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  const handleOpenDetail = () => {
    onOpenDetail(post.id)
  }

  const handleLike = (event: React.MouseEvent) => {
    event.stopPropagation()
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1)
  }

  return (
    <article
      ref={cardRef}
      className="free-post-card"
      data-post-id={post.id}
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
      <div className="free-post-card__top">
        <span className={`free-post-card__category free-post-card__category--${post.category}`}>
          {post.category}
        </span>
        <span className="free-post-card__time">{post.timeAgo}</span>
      </div>

      <h3>{post.title}</h3>
      <p className="free-post-card__body">{post.body}</p>

      <div className="free-post-card__bottom">
        <span className="free-post-card__meta">
          {post.mascot && <span aria-hidden="true"><img src={post.mascot} alt="User" /></span>}
          {post.user}
        </span>
        <div className="free-post-card__stats">
          <button
            type="button"
            className={`free-post-card__like-btn${liked ? ' is-liked' : ''}`}
            onClick={handleLike}
            aria-label={liked ? '좋아요 취소' : '좋아요'}
          >
            <HeartIcon filled={liked} />
            {likeCount}
          </button>
          <span>
            <BoardActionIcon kind="comment" />
            {post.comments}
          </span>
        </div>
      </div>
    </article>
  )
}

function shouldShowPost(post: BoardPost, activeFilter: BoardFilter) {
  const categoryFilters = boardFilters.slice(2)

  if (categoryFilters.includes(activeFilter)) {
    return post.category === activeFilter
  }

  return true
}

function timeAgoToMinutes(timeAgo: string): number {
  if (timeAgo.includes('방금')) return 0
  const value = Number(timeAgo.match(/\d+/)?.[0] ?? 0)
  if (timeAgo.includes('시간')) return value * 60
  if (timeAgo.includes('일')) return value * 60 * 24
  return value
}

function sortPosts(posts: BoardPost[], filter: BoardFilter): BoardPost[] {
  if (filter === '인기순') return [...posts].sort((a, b) => b.likes - a.likes)
  if (filter === '최신순') return [...posts].sort((a, b) => timeAgoToMinutes(a.timeAgo) - timeAgoToMinutes(b.timeAgo))
  return posts
}

function BoardList({
  activeFilter,
  onOpenDetail,
  extraPosts = [],
  focusPostId = null,
  onFocusHandled,
}: BoardListProps) {
  const listRef = useRef<HTMLElement | null>(null)
  const sourcePosts = [...extraPosts, ...mockBoardPosts]
  const filteredPosts = sourcePosts.filter((post) => shouldShowPost(post, activeFilter))
  const visiblePosts = sortPosts(filteredPosts, activeFilter)
  const hasFocusTarget = focusPostId ? visiblePosts.some((post) => post.id === focusPostId) : false

  useEffect(() => {
    if (!focusPostId || !hasFocusTarget) {
      return
    }

    const targetCard = listRef.current?.querySelector<HTMLElement>(`[data-post-id="${focusPostId}"]`)

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
  }, [focusPostId, hasFocusTarget, onFocusHandled])

  return (
    <section ref={listRef} key={activeFilter} className="free-detail-list" aria-label="자유게시판 글 목록">
      {visiblePosts.map((post) => (
        <BoardCard
          key={post.id}
          post={post}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </section>
  )
}

export default BoardList

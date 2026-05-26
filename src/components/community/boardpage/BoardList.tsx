import './BoardList.css'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useUserProfile } from '../../common/useUserProfile'
import carrotPro from '../../../assets/food_mascot/carrot_pro.png'
import broPro from '../../../assets/food_mascot/bro_pro.png'
import strawPro from '../../../assets/food_mascot/straw_pro.png'
import eggPro from '../../../assets/food_mascot/egg_pro.png'
import bluePro from '../../../assets/food_mascot/blue_pro.png'

const proMascots = [carrotPro, broPro, strawPro, eggPro, bluePro]
import { boardFilters, type BoardFilter } from './boardCategoryFilterData'
import { mockBoardPosts, mockBoardComments, mockBoardDetailPosts } from '../common/boardMockData'
import { readPersistedBoardComments } from '../common/boardCommentPersistence'
import {
  getBoardReactionKey,
  readPersistedBoardLikeKeys,
  savePersistedBoardLikeKeys,
} from '../common/boardReactionPersistence'
import bannerBg from './images/banner_bg.png'

export type BoardPost = {
  id: string
  category: string
  title: string
  body: string
  user: string
  authorId?: string
  avatar?: string
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

function isMascotAvatarImage(src?: string) {
  if (!src) return false
  return src.includes('_pro') || src.includes('_mascot') || src.includes('food_mascot')
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

function BoardBanner() {
  return (
    <div className="board-banner" style={{ backgroundImage: `url(${bannerBg})` }}>
      <div className="board-banner__text">
        <p className="board-banner__title">오늘의 냉장고 활용 TIP</p>
        <p className="board-banner__body">줄기채소는 세워서 보관하면<br />신선도가 2배 오래가요!</p>
      </div>
    </div>
  )
}

function BoardCard({
  post,
  onOpenDetail,
  currentUserId,
  currentNickname,
  currentAvatar,
}: {
  post: BoardPost
  onOpenDetail: (postId: string) => void
  currentUserId: string
  currentNickname: string
  currentAvatar?: string
}) {
  const cardRef = useRef<HTMLElement>(null)
  const reactionKey = getBoardReactionKey(post.id, currentUserId)
  const [liked, setLiked] = useState(() => readPersistedBoardLikeKeys().includes(reactionKey))
  const [likeCount, setLikeCount] = useState(post.likes)
  const randomMascot = useMemo(() => proMascots[Math.floor(Math.random() * proMascots.length)], [])
  const isOwnPost = Boolean(post.authorId && post.authorId === currentUserId)
  const displayName = isOwnPost ? currentNickname : post.user
  const displayAvatar = isOwnPost ? currentAvatar ?? post.avatar ?? post.mascot ?? randomMascot : post.avatar ?? post.mascot ?? randomMascot
  const isMascotAvatar = isMascotAvatarImage(displayAvatar)

  useEffect(() => {
    const isLiked = readPersistedBoardLikeKeys().includes(reactionKey)
    setLiked(isLiked)
    setLikeCount(post.likes + (isLiked ? 1 : 0))
  }, [post.likes, reactionKey])

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

    const persistedLikeKeys = readPersistedBoardLikeKeys()
    const isAlreadyLiked = persistedLikeKeys.includes(reactionKey)
    const nextLikeKeys = isAlreadyLiked
      ? persistedLikeKeys.filter((key) => key !== reactionKey)
      : [...persistedLikeKeys, reactionKey]

    savePersistedBoardLikeKeys(nextLikeKeys)
    setLiked(!isAlreadyLiked)
    setLikeCount(post.likes + (!isAlreadyLiked ? 1 : 0))
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
          <span aria-hidden="true"><img src={displayAvatar} alt="" className={isMascotAvatar ? 'is-mascot' : undefined} /></span>
          {displayName}
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
  const { email, nickname, avatar } = useUserProfile()
  const listRef = useRef<HTMLElement | null>(null)
  const persistedComments = readPersistedBoardComments()
  const mockPostIds = new Set(mockBoardDetailPosts.map((p) => p.id))
  const sourcePosts = [...extraPosts, ...mockBoardPosts]
  const filteredPosts = sourcePosts.filter((post) => shouldShowPost(post, activeFilter))
  const visiblePosts = sortPosts(filteredPosts, activeFilter).map((post) => ({
    ...post,
    comments: persistedComments[post.id]?.length ?? (mockPostIds.has(post.id) ? mockBoardComments.length : post.comments),
  }))
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

  const BANNER_INSERT_INDEX = 2

  return (
    <section ref={listRef} key={activeFilter} className="free-detail-list" aria-label="자유게시판 글 목록">
      {visiblePosts.map((post, index) => (
        <React.Fragment key={post.id}>
          {index === BANNER_INSERT_INDEX && <BoardBanner />}
          <BoardCard
            post={post}
            onOpenDetail={onOpenDetail}
            currentUserId={email}
            currentNickname={nickname}
            currentAvatar={avatar}
          />
        </React.Fragment>
      ))}
    </section>
  )
}

export default BoardList

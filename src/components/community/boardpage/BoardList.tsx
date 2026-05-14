import './BoardList.css'
import { boardFilters, type BoardFilter } from './BoardCategoryFilters'
import { mockBoardPosts } from '../common/boardMockData'

export type BoardPost = {
  id: string
  category: string
  title: string
  body: string
  user: string
  authorId?: string
  timeAgo: string
  likes: number
  comments: number
  highlighted?: boolean
}

type BoardListProps = {
  activeFilter: BoardFilter
  onOpenDetail: (postId: string) => void
  extraPosts?: BoardPost[]
}

function BoardActionIcon({ kind }: { kind: 'heart' | 'comment' | 'bookmark' }) {
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

function BoardCard({
  post,
  onOpenDetail,
}: {
  post: BoardPost
  onOpenDetail: (postId: string) => void
}) {
  const handleOpenDetail = () => {
    onOpenDetail(post.id)
  }

  return (
    <article
      className="free-post-card"
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

      <h2>{post.title}</h2>
      <p className="free-post-card__body">{post.body}</p>

      <div className="free-post-card__bottom">
        <span className="free-post-card__meta">
          <span aria-hidden="true">🐥</span>
          {post.user}
        </span>
        <div className="free-post-card__stats">
          <span>
            <BoardActionIcon kind="heart" />
            {post.likes}
          </span>
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

function BoardList({ activeFilter, onOpenDetail, extraPosts = [] }: BoardListProps) {
  const sourcePosts = [...extraPosts, ...mockBoardPosts]
  const visiblePosts = sourcePosts.filter((post) => shouldShowPost(post, activeFilter))

  return (
    <section className="free-detail-list" aria-label="자유게시판 글 목록">
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

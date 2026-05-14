import type { CommunityMediaAttachment } from '../communitywritepage/writeTypes'

export type BoardDetailPost = {
  id: string
  category: string
  reward: string
  title: string
  author: string
  authorId?: string
  timeAgo: string
  likes: number
  comments: number
  paragraphs: string[]
  methods: string[]
  media?: CommunityMediaAttachment[]
}

function BoardContentIcon({ kind }: { kind: 'heart' | 'comment' }) {
  if (kind === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
    </svg>
  )
}

type BoardContentProps = {
  post: BoardDetailPost
  isLiked?: boolean
  onLikeClick?: () => void
}

function BoardContent({ post, isLiked = false, onLikeClick }: BoardContentProps) {
  return (
    <>
      <h1>{post.title}</h1>

      <div className="board-detail-meta-row">
        <p className="board-detail-meta">{post.author} · {post.timeAgo}</p>

        <div className="board-detail-stats">
          <button
            type="button"
            className={`board-detail-stats__item board-detail-stats__heart${isLiked ? ' is-active' : ''}`}
            aria-label="게시물 좋아요"
            aria-pressed={isLiked}
            onClick={onLikeClick}
          >
            <BoardContentIcon kind="heart" />
            {post.likes}
          </button>
          <span className="board-detail-stats__item">
            <BoardContentIcon kind="comment" />
            {post.comments}
          </span>
        </div>
      </div>

      <section className="board-detail-body">
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {post.methods.length > 0 && (
          <div className="board-detail-method-box">
            <ol>
              {post.methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ol>
          </div>
        )}

        {post.media && post.media.length > 0 && (
          <div className="board-detail-media-grid" aria-label="첨부 미디어">
            {post.media.map((attachment) => {
              if (!attachment.url) {
                return null
              }

              const mediaLabel = attachment.name ?? (attachment.kind === 'image' ? '첨부 사진' : '첨부 동영상')

              return (
                <figure key={attachment.id} className="board-detail-media-item">
                  {attachment.kind === 'image' ? (
                    <img src={attachment.url} alt={mediaLabel} />
                  ) : (
                    <video src={attachment.url} controls playsInline aria-label={mediaLabel} />
                  )}
                </figure>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

export default BoardContent

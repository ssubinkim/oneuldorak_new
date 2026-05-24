import { useRef, useState, type FormEvent } from 'react'
import CommentItem, { type BoardComment } from './CommentItem'

type CommentSectionProps = {
  comments: BoardComment[]
  currentUserId: string
  currentUserName: string
  onAddComment: (text: string) => void
  onUpdateComment: (commentId: string, text: string) => void
  onDeleteComment: (commentId: string) => void
}

const INITIAL_VISIBLE_COUNT = 5

function CommentSection({
  comments,
  currentUserId,
  currentUserName,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const lastSubmittedRef = useRef<{ text: string; at: number } | null>(null)

  const visibleComments = isExpanded ? comments : comments.slice(0, INITIAL_VISIBLE_COUNT)
  const hiddenCount = comments.length - INITIAL_VISIBLE_COUNT

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    const trimmedText = commentText.trim()

    if (!trimmedText) {
      return
    }

    const now = Date.now()
    if (
      lastSubmittedRef.current &&
      lastSubmittedRef.current.text === trimmedText &&
      now - lastSubmittedRef.current.at < 700
    ) {
      return
    }

    onAddComment(trimmedText)
    lastSubmittedRef.current = { text: trimmedText, at: now }
    setCommentText('')
  }

  return (
    <section className="board-detail-comments">
      <div className="board-detail-comments__header">
        <h2>댓글 ({comments.length})</h2>
      </div>

      <form className="board-detail-comments__input" onSubmit={handleSubmit}>
        <span className="board-detail-comment-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8.4" r="3.3" />
            <path d="M5.6 19.2c.8-3.3 3.1-5.2 6.4-5.2s5.6 1.9 6.4 5.2" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') {
              return
            }

            if (event.nativeEvent.isComposing || event.repeat) {
              event.preventDefault()
            }
          }}
        />
        <button type="submit" aria-label="댓글 작성">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
          </svg>
        </button>
      </form>

      <div className="board-detail-comments__list">
        {visibleComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            canManage={
              comment.authorId
                ? comment.authorId === currentUserId
                : comment.id.startsWith('comment-') && comment.user === currentUserName
            }
            onUpdate={onUpdateComment}
            onDelete={onDeleteComment}
          />
        ))}
        {!isExpanded && hiddenCount > 0 && (
          <div className="board-detail-comments__more">
            <button
              type="button"
              className="board-detail-comments__more-btn"
              onClick={() => setIsExpanded(true)}
            >
              더 보기 ({hiddenCount}개)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CommentSection

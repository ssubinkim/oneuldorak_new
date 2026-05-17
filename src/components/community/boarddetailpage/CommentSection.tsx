import { useState } from 'react'
import CommentItem, { type BoardComment } from './CommentItem'

type CommentSectionProps = {
  comments: BoardComment[]
  currentUserId: string
  currentUserName: string
  onAddComment: (text: string) => void
  onUpdateComment: (commentId: string, text: string) => void
  onDeleteComment: (commentId: string) => void
}

function CommentSection({
  comments,
  currentUserId,
  currentUserName,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('')

  const handleSubmit = () => {
    const trimmedText = commentText.trim()

    if (!trimmedText) {
      return
    }

    onAddComment(trimmedText)
    setCommentText('')
  }

  return (
    <section className="board-detail-comments">
      <div className="board-detail-comments__header">
        <h2>댓글 ({comments.length})</h2>
        <span>최신순&nbsp;&nbsp;인기순</span>
      </div>

      <div className="board-detail-comments__input">
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
            if (event.key === 'Enter') {
              handleSubmit()
            }
          }}
        />
        <button type="button" aria-label="댓글 작성" onClick={handleSubmit}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
          </svg>
        </button>
      </div>

      <div className="board-detail-comments__list">
        {comments.map((comment) => (
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
      </div>
    </section>
  )
}

export default CommentSection

import { useState } from 'react'
import CommentItem, { type BoardComment } from './CommentItem'

type CommentSectionProps = {
  comments: BoardComment[]
  currentUserId: string
  onAddComment: (text: string) => void
  onUpdateComment: (commentId: string, text: string) => void
  onDeleteComment: (commentId: string) => void
}

function CommentSection({
  comments,
  currentUserId,
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
        <h2>댓글 {comments.length}</h2>
        <span>댓글 작성 시 1P 적립</span>
      </div>

      <div className="board-detail-comments__list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            canManage={Boolean(comment.authorId && comment.authorId === currentUserId)}
            onUpdate={onUpdateComment}
            onDelete={onDeleteComment}
          />
        ))}
      </div>

      <div className="board-detail-comments__input">
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
        <button type="button" onClick={handleSubmit}>작성</button>
      </div>
    </section>
  )
}

export default CommentSection

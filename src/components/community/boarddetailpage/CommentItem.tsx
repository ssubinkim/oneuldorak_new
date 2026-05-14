import { useState } from 'react'

export type BoardComment = {
  id: string
  user: string
  authorId?: string
  timeAgo: string
  text: string
}

type CommentItemProps = {
  comment: BoardComment
  canManage: boolean
  onUpdate: (commentId: string, text: string) => void
  onDelete: (commentId: string) => void
}

function CommentItem({ comment, canManage, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(comment.text)

  const handleCancelEdit = () => {
    setDraftText(comment.text)
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    const trimmedText = draftText.trim()

    if (!trimmedText) {
      return
    }

    onUpdate(comment.id, trimmedText)
    setIsEditing(false)
  }

  return (
    <article>
      <div className="board-detail-comment__head">
        <h3>
          {comment.user}
          <span>{comment.timeAgo}</span>
        </h3>
        {canManage && !isEditing && (
          <div className="board-detail-comment__actions">
            <button type="button" onClick={() => setIsEditing(true)}>수정</button>
            <button type="button" onClick={() => onDelete(comment.id)}>삭제</button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="board-detail-comment__edit">
          <input
            type="text"
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSaveEdit()
              }

              if (event.key === 'Escape') {
                handleCancelEdit()
              }
            }}
          />
          <div className="board-detail-comment__edit-actions">
            <button type="button" onClick={handleCancelEdit}>취소</button>
            <button type="button" onClick={handleSaveEdit}>저장</button>
          </div>
        </div>
      ) : (
        <p>{comment.text}</p>
      )}
    </article>
  )
}

export default CommentItem

import { useState } from 'react'
import eggMascot from '../../../assets/food_mascot/egg_mascot.png'
import strawMascot from '../../../assets/food_mascot/straw_mascot.png'
import blueMascot from '../../../assets/food_mascot/blue_mascot.png'
import carrotMascot from '../../../assets/food_mascot/carrot_mascot.png'
import broMascot from '../../../assets/food_mascot/bro_mascot.png'

const mascots = [eggMascot, strawMascot, blueMascot, carrotMascot, broMascot]

function getMascot(username: string): string {
  const hash = username.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return mascots[hash % mascots.length]
}

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
    <article className="board-detail-comment">
      <span className="board-detail-comment-avatar" aria-hidden="true">
        <img src={getMascot(comment.user)} alt="" />
      </span>

      <div className="board-detail-comment__content">
        <div className="board-detail-comment__head">
          <h3>
            {comment.user}
            <span>{comment.timeAgo}</span>
          </h3>
          {canManage && !isEditing && (
            <div className="board-detail-comment__manage">
              <button type="button" onClick={() => { setDraftText(comment.text); setIsEditing(true) }}>수정</button>
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
          <>
            <p>{comment.text}</p>
            <div className="board-detail-comment__actions">
              <button type="button">좋아요</button>
              <button type="button">댓글</button>
              {!canManage && <button type="button">신고</button>}
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export default CommentItem

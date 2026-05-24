import { useState } from 'react'
import { useUserProfile } from '../../common/useUserProfile'
import carrotPro from '../../../assets/food_mascot/carrot_pro.png'
import broPro from '../../../assets/food_mascot/bro_pro.png'
import strawPro from '../../../assets/food_mascot/straw_pro.png'
import eggPro from '../../../assets/food_mascot/egg_pro.png'
import bluePro from '../../../assets/food_mascot/blue_pro.png'

const proMascots = [carrotPro, broPro, strawPro, eggPro, bluePro]

function getMascot(username: string): string {
  const hash = username.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return proMascots[hash % proMascots.length]
}

function isMascotAvatarImage(src?: string) {
  if (!src) return false
  return src.includes('_pro') || src.includes('_mascot') || src.includes('food_mascot')
}

export type BoardComment = {
  id: string
  user: string
  authorId?: string
  avatar?: string
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
  const { email, nickname, avatar } = useUserProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(comment.text)
  const isOwnComment = Boolean(comment.authorId && comment.authorId === email)
  const displayName = isOwnComment ? nickname : comment.user
  const displayAvatar = isOwnComment ? avatar ?? comment.avatar ?? getMascot(comment.user) : comment.avatar ?? getMascot(comment.user)
  const isMascotAvatar = isMascotAvatarImage(displayAvatar)

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
        <img src={displayAvatar} alt="" className={isMascotAvatar ? 'is-mascot' : undefined} />
      </span>

      <div className="board-detail-comment__content">
        <div className="board-detail-comment__head">
          <h3>
            {displayName}
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

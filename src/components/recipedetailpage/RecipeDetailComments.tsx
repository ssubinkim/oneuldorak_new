import { useState, type FormEvent } from 'react'
import type { RecipeComment } from './recipeDetailData'
import blueMascotIcon from '../../assets/food_mascot/blue_mascot.png'
import broMascotIcon from '../../assets/food_mascot/bro_mascot.png'
import carrotMascotIcon from '../../assets/food_mascot/carrot_mascot.png'
import eggMascotIcon from '../../assets/food_mascot/egg_mascot.png'
import strawMascotIcon from '../../assets/food_mascot/straw_mascot.png'

const mascotIcons = [blueMascotIcon, broMascotIcon, carrotMascotIcon, eggMascotIcon, strawMascotIcon]

function getMascotIcon(seed: string) {
  const value = seed.split('').reduce((sum, ch, i) => sum + ch.charCodeAt(0) * (i + 1), 0)
  return mascotIcons[value % mascotIcons.length]
}

type RecipeDetailCommentsProps = {
  comments: RecipeComment[]
  currentUserId: string
  currentUserName: string
  onAddComment?: (content: string) => void
  onUpdateComment?: (commentId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
}

function RecipeDetailComments({
  comments,
  currentUserId,
  currentUserName,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: RecipeDetailCommentsProps) {
  const [commentText, setCommentText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedText = commentText.trim()

    if (!trimmedText) {
      return
    }

    onAddComment?.(trimmedText)
    setCommentText('')
  }

  const handleStartEdit = (comment: RecipeComment) => {
    setEditingCommentId(comment.id)
    setEditingCommentText(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingCommentText('')
  }

  const handleSaveEdit = (commentId: string) => {
    const trimmedText = editingCommentText.trim()

    if (!trimmedText) {
      return
    }

    onUpdateComment?.(commentId, trimmedText)
    handleCancelEdit()
  }

  const isOwnComment = (comment: RecipeComment) => {
    if (comment.authorId) {
      return comment.authorId === currentUserId
    }

    return comment.authorName === currentUserName
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
          aria-label="댓글 입력"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />
        <button type="submit" aria-label="댓글 작성">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
          </svg>
        </button>
      </form>

      <div className="board-detail-comments__list">
        {comments.map((comment) => {
          const canManage = isOwnComment(comment)
          const isEditing = editingCommentId === comment.id

          return (
            <article className="board-detail-comment" key={comment.id}>
              <span className="board-detail-comment-avatar" aria-hidden="true">
                <img src={getMascotIcon(comment.authorName)} alt="" className="is-mascot" />
              </span>

              <div className="board-detail-comment__content">
                <div className="board-detail-comment__head">
                  <h3>
                    {comment.authorName}
                    <span>{comment.publishedOn}</span>
                  </h3>
                  {canManage && !isEditing && (
                    <div className="board-detail-comment__manage">
                      <button type="button" onClick={() => handleStartEdit(comment)}>수정</button>
                      <button type="button" onClick={() => onDeleteComment?.(comment.id)}>삭제</button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="board-detail-comment__edit">
                    <input
                      type="text"
                      value={editingCommentText}
                      onChange={(event) => setEditingCommentText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleSaveEdit(comment.id)
                        }

                        if (event.key === 'Escape') {
                          handleCancelEdit()
                        }
                      }}
                    />
                    <div className="board-detail-comment__edit-actions">
                      <button type="button" onClick={handleCancelEdit}>취소</button>
                      <button type="button" onClick={() => handleSaveEdit(comment.id)}>저장</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{comment.content}</p>
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
        })}
      </div>
    </section>
  )
}

export default RecipeDetailComments

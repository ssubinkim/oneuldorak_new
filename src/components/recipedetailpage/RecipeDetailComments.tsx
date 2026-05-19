import { useState, type FormEvent } from 'react'
import type { RecipeComment } from './recipeDetailData'
import { StatIcon } from './RecipeDetailIcons'
import blueMascotIcon from '../../assets/food_mascot/blue_mascot.svg'
import broMascotIcon from '../../assets/food_mascot/bro_mascot.svg'
import carrotMascotIcon from '../../assets/food_mascot/carrot_mascot.svg'
import eggMascotIcon from '../../assets/food_mascot/egg_mascot.svg'
import strawMascotIcon from '../../assets/food_mascot/straw_mascot.svg'

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
  const [commentInput, setCommentInput] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextContent = commentInput.trim()
    if (!nextContent) {
      return
    }

    onAddComment?.(nextContent)
    setCommentInput('')
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
    const nextContent = editingCommentText.trim()

    if (!nextContent) {
      return
    }

    onUpdateComment?.(commentId, nextContent)
    handleCancelEdit()
  }

  const isOwnComment = (comment: RecipeComment) => {
    if (comment.authorId) {
      return comment.authorId === currentUserId
    }

    return comment.authorName === currentUserName
  }

  return (
    <section className="recipe-detail-section recipe-detail-comments">
      <div className="recipe-detail-comments__header">
        <h2>
          댓글
          <span>+1p</span>
        </h2>
        <button type="button">더보기</button>
      </div>

      <form className="recipe-detail-comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          aria-label="댓글 입력"
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
        />
        <button type="submit" aria-label="댓글 등록">
          <StatIcon type="send" />
        </button>
      </form>

      <div className="recipe-detail-comments__list">
        {comments.map((comment) => {
          const canManageComment = isOwnComment(comment)
          const isEditing = editingCommentId === comment.id

          return (
            <article key={comment.id}>
              <div className="recipe-detail-comment-head">
                <span className="recipe-detail-comment-mascot" aria-hidden="true">
                  <img src={getMascotIcon(comment.authorName)} alt="" />
                </span>
                <h3>
                  {comment.authorName}
                  <span>{comment.publishedOn}</span>
                </h3>

                {canManageComment && !isEditing ? (
                  <div className="recipe-detail-comment-actions">
                    <button type="button" onClick={() => handleStartEdit(comment)}>수정</button>
                    <button type="button" onClick={() => onDeleteComment?.(comment.id)}>삭제</button>
                  </div>
                ) : null}
              </div>

              {isEditing ? (
                <div className="recipe-detail-comment-edit">
                  <input
                    type="text"
                    aria-label="댓글 수정"
                    value={editingCommentText}
                    onChange={(event) => setEditingCommentText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleSaveEdit(comment.id)
                      }
                    }}
                  />
                  <div className="recipe-detail-comment-edit__actions">
                    <button type="button" onClick={handleCancelEdit}>취소</button>
                    <button type="button" onClick={() => handleSaveEdit(comment.id)}>저장</button>
                  </div>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default RecipeDetailComments

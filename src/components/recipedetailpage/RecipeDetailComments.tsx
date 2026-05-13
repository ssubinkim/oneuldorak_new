import { useState, type FormEvent } from 'react'
import type { RecipeComment } from './recipeDetailData'
import { StatIcon } from './RecipeDetailIcons'

type RecipeDetailCommentsProps = {
  comments: RecipeComment[]
  onAddComment?: (content: string) => void
}

function RecipeDetailComments({ comments, onAddComment }: RecipeDetailCommentsProps) {
  const [commentInput, setCommentInput] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextContent = commentInput.trim()
    if (!nextContent) {
      return
    }

    onAddComment?.(nextContent)
    setCommentInput('')
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

      <div className="recipe-detail-comments__list">
        {comments.map((comment) => (
          <article key={comment.id}>
            <h3>
              {comment.authorName}
              <span>{comment.publishedOn}</span>
            </h3>
            <p>{comment.content}</p>
          </article>
        ))}
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
    </section>
  )
}

export default RecipeDetailComments

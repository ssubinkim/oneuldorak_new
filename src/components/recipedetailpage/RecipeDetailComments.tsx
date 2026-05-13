import type { RecipeComment } from './recipeDetailData'
import { StatIcon } from './RecipeDetailIcons'

type RecipeDetailCommentsProps = {
  comments: RecipeComment[]
}

function RecipeDetailComments({ comments }: RecipeDetailCommentsProps) {
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
          <article key={`${comment.user}-${comment.text}`}>
            <h3>
              {comment.user}
              <span>{comment.date}</span>
            </h3>
            <p>{comment.text}</p>
          </article>
        ))}
      </div>

      <form
        className="recipe-detail-comment-form"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <input type="text" placeholder="댓글을 입력하세요" aria-label="댓글 입력" />
        <button type="submit" aria-label="댓글 등록">
          <StatIcon type="send" />
        </button>
      </form>
    </section>
  )
}

export default RecipeDetailComments

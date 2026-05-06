export type BoardComment = {
  user: string
  timeAgo: string
  text: string
}

function CommentItem({ comment }: { comment: BoardComment }) {
  return (
    <article>
      <h3>
        {comment.user}
        <span>{comment.timeAgo}</span>
      </h3>
      <p>{comment.text}</p>
    </article>
  )
}

export default CommentItem

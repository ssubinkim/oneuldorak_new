export type BoardDetailPost = {
  id: string
  category: string
  reward: string
  title: string
  author: string
  timeAgo: string
  likes: number
  comments: number
  paragraphs: string[]
  methods: string[]
}

function BoardContentIcon({ kind }: { kind: 'heart' | 'comment' }) {
  if (kind === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
    </svg>
  )
}

function BoardContent({ post }: { post: BoardDetailPost }) {
  return (
    <>
      <div className="board-detail-badges">
        <span className="board-detail-badge board-detail-badge--category">{post.category}</span>
        <span className="board-detail-badge board-detail-badge--trend">↗</span>
        <span className="board-detail-badge board-detail-badge--reward">{post.reward}</span>
      </div>

      <h1>{post.title}</h1>
      <p className="board-detail-meta">{post.author} · {post.timeAgo}</p>

      <div className="board-detail-stats">
        <span>
          <BoardContentIcon kind="heart" />
          {post.likes}
        </span>
        <span>
          <BoardContentIcon kind="comment" />
          {post.comments}
        </span>
      </div>

      <div className="board-detail-body">
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {post.methods.length > 0 && (
          <section className="board-detail-method-box">
            <h2>실천 방법</h2>
            <ol>
              {post.methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  )
}

export default BoardContent

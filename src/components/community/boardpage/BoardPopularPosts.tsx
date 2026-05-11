import './BoardPopularPosts.css'

export type BoardPopularPost = {
  rank: number
  title: string
  likes: number
  comments: number
}

type BoardPopularPostsProps = {
  posts: BoardPopularPost[]
}

function BoardPopularPosts({ posts }: BoardPopularPostsProps) {
  return (
    <section className="board-popular-posts" aria-label="실시간 인기글">
      <h2>실시간 인기글 TOP3</h2>

      <ol className="board-popular-posts__list">
        {posts.map((post) => (
          <li key={post.rank} className={post.rank === 1 ? 'is-top' : undefined}>
            <span className="board-popular-posts__rank">{post.rank}</span>
            <div>
              <strong>{post.title}</strong>
              <p>♡ {post.likes} · 댓글 {post.comments}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default BoardPopularPosts

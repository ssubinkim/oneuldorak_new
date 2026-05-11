import './PopularPosts.css'

type HotPost = {
  rank: number
  title: string
  likes: number
  comments: number
}

type PopularPostsProps = {
  posts: HotPost[]
}

function PopularPosts({ posts }: PopularPostsProps) {
  return (
    <section className="hot-posts">
      <div className="hot-posts__header">
        <h2>실시간 인기글 TOP3</h2>
        <button type="button">더보기 ›</button>
      </div>
      <div className="hot-posts__card">
        {posts.map((post, index) => (
          <article key={post.rank} className="hot-post-item">
            {index > 0 && <div className="hot-post-item__divider" />}
            <span className={`hot-post-item__rank${post.rank === 1 ? ' hot-post-item__rank--first' : ''}`}>
              {post.rank}
            </span>
            <div className="hot-post-item__content">
              <p className="hot-post-item__title">{post.title}</p>
              <div className="hot-post-item__meta">
                <span>❤{post.likes}</span>
                <span>💬{post.comments}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PopularPosts

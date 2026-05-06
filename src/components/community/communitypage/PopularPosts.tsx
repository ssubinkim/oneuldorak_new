import './PopularPosts.css'

type PopularPost = {
  title: string
  likes: number
  comments: number
}

type PopularPostsProps = {
  posts: PopularPost[]
}

function PopularPostItem({ title, likes, comments }: PopularPost) {
  return (
    <article className="popular-post-item">
      <div className="popular-post-item__thumb" aria-hidden="true" />
      <div className="popular-post-item__content">
        <h3>{title}</h3>
        <div className="popular-post-item__meta">
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 5.9l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5l1.3 1.3L12 20.9l7.5-7.5 1.3-1.3a5.3 5.3 0 0 0 0-7.5Z" />
            </svg>
            좋아요 {likes}
          </span>
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.8 8.8 0 0 1-3.9-.9L3 20l1.2-4.1a8.1 8.1 0 0 1-1.1-4.1 8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.9 8.1Z" />
            </svg>
            댓글 {comments}
          </span>
        </div>
      </div>
    </article>
  )
}

function PopularPosts({ posts }: PopularPostsProps) {
  return (
    <section className="popular-posts">
      <div className="popular-posts__header">
        <h2>오늘의 인기글</h2>
      </div>
      <div className="popular-posts__list">
        {posts.map((post) => (
          <PopularPostItem
            key={post.title}
            title={post.title}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>
    </section>
  )
}

export default PopularPosts

import { ArrowRightIcon } from '../../common/ui/ArrowRightIcon'
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
    <section className="hot-posts" aria-label="실시간 인기글">
      <div className="hot-posts__header">
        <h2>실시간 인기글</h2>
        <button type="button">더보기 <ArrowRightIcon /></button>
      </div>

      <ol className="hot-posts__list">
        {posts.map((post) => (
          <li key={post.rank} className="hot-post-item">
            <span className={`hot-post-item__rank${post.rank === 1 ? ' hot-post-item__rank--first' : ''}`}>{post.rank}</span>
            <div className="hot-post-item__thumb" aria-hidden="true" />
            <div className="hot-post-item__content">
              <p className="hot-post-item__title">{post.title}</p>
              <p className="hot-post-item__meta">
                <span className="hot-post-item__meta-icon">♡ {post.likes}</span>
                <span className="hot-post-item__meta-icon">💬 {post.comments}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default PopularPosts

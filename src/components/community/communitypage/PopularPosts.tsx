import { ArrowRightIcon } from '../../common/ui/ArrowRightIcon'
import SequentialHighlightList, { type SequentialHighlightItem } from '../../effects/stagger/SequentialHighlightList'
import subreview1 from '../../store/images/subreview/subreview_1.png'
import subreview2 from '../../store/images/subreview/subreview_2.png'
import subreview3 from '../../store/images/subreview/subreview_3.png'
import './PopularPosts.css'

type HotPost = {
  rank: number
  title: string
  likes: number
  comments: number
}

type PopularPostsProps = {
  posts: HotPost[]
  onMoreClick?: () => void
}

function PopularPosts({ posts, onMoreClick }: PopularPostsProps) {
  const thumbnails = [subreview1, subreview2, subreview3]
  const storyItems: SequentialHighlightItem[] = posts.map((post, index) => ({
    id: `${post.rank}-${post.title}`,
    title: post.title,
    likes: post.likes,
    comments: post.comments,
    thumbnailImage: thumbnails[index % thumbnails.length],
  }))

  return (
    <section className="hot-posts" aria-label="실시간 인기글">
      <div className="hot-posts__header">
        <h2>실시간 인기글</h2>
        <button type="button" onClick={onMoreClick}>더보기 <ArrowRightIcon /></button>
      </div>

      <div className="story-list">
        <SequentialHighlightList
          className="community-hot-posts__stagger"
          items={storyItems}
          intervalMs={1200}
          startIndex={0}
          loop
          autoplay
        />
      </div>
    </section>
  )
}

export default PopularPosts

import { ArrowRightIcon } from '../../common/ui/ArrowRightIcon'
import SequentialHighlightList, { type SequentialHighlightItem } from '../../effects/stagger/SequentialHighlightList'
import talk1 from '../common/images/talk1.png'
import talk2 from '../common/images/talk2.png'
import talk3 from '../common/images/talk3.png'
import './PopularPosts.css'

type HotPost = {
  id?: string
  rank: number
  title: string
  likes: number
  comments: number
}

type PopularPostsProps = {
  posts: HotPost[]
  onMoreClick?: () => void
  onPostClick?: (postId: string) => void
}

function PopularPosts({ posts, onMoreClick, onPostClick }: PopularPostsProps) {
  const thumbnails = [talk1, talk2, talk3]
  const storyItems: SequentialHighlightItem[] = posts.map((post, index) => ({
    id: post.id ?? `${post.rank}-${post.title}`,
    title: post.title,
    likes: post.likes,
    comments: post.comments,
    thumbnailImage: thumbnails[index % thumbnails.length],
  }))

  return (
    <section className="hot-posts" aria-label="실시간 인기글">
      <div className="commu_all_header">
        <div className="commu_all_titles hot-posts__heading">
          <h2 className="commu_all_title">지금 인기 있는 냉털 이야기</h2>
          <p className="commu_all_subtitle">실시간 인기글 TOP3</p>
        </div>
        <button type="button" className="commu_all_more" onClick={onMoreClick}>더보기 <ArrowRightIcon /></button>
      </div>

      <div className="story-list">
        <SequentialHighlightList
          className="community-hot-posts__stagger"
          items={storyItems}
          intervalMs={1400}
          startIndex={0}
          loop
          autoplay
          onItemClick={onPostClick ? (id) => onPostClick(String(id)) : undefined}
        />
      </div>
    </section>
  )
}

export default PopularPosts

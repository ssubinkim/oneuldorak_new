import { ArrowRightIcon } from '../../common/ui/ArrowRightIcon'
import SequentialHighlightList, { type SequentialHighlightItem } from '../../effects/stagger/SequentialHighlightList'
import talk1 from '../common/images/talk1.png'
import talk2 from '../common/images/talk2.png'
import talk3 from '../common/images/talk3.png'
import talkGroup from '../common/images/talk.png'
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
  showHeaderImage?: boolean
}

function PopularPosts({ posts, onMoreClick, showHeaderImage = true }: PopularPostsProps) {
  const thumbnails = [talk1, talk2, talk3]
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
        <div className="hot-posts__header-left">
          <h2>지금 인기 있는<br />냉털 이야기 👀</h2>
          <div className="hot-posts__header-sub">
            <span>이번주 인기글 TOP3</span>
            <button type="button" onClick={onMoreClick}>보러가기 <ArrowRightIcon /></button>
          </div>
        </div>
        {showHeaderImage && <img className="hot-posts__header-img" src={talkGroup} alt="" aria-hidden="true" />}
      </div>

      <div className="story-list">
        <SequentialHighlightList
          className="community-hot-posts__stagger"
          items={storyItems}
          intervalMs={1400}
          startIndex={0}
          loop
          autoplay
        />
      </div>
    </section>
  )
}

export default PopularPosts

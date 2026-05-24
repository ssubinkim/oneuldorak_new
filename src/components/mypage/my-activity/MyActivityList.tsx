import LikePostCard, { type LikePost } from '../like-page/LikePostCard'
import './MyActivityList.css'

type MyActivityListProps = {
  items: LikePost[]
  unit: string
  emptyTitle: string
  emptyDescription: string
}

function MyActivityList({ items, unit, emptyTitle, emptyDescription }: MyActivityListProps) {
  return (
    <div className="page-scroll">
      <section className="my-activity-list-page">
        <div className="my-activity-list-page__bar">
          <span>총 {items.length}개의 {unit}</span>
        </div>

        <div className="my-activity-list-page__list">
          {items.length > 0 ? (
            items.map((item) => <LikePostCard key={item.id} post={item} showHeartButton={false} />)
          ) : (
            <div className="lp-card">
              <div className="lp-card-title">{emptyTitle}</div>
              <div className="lp-card-date">{emptyDescription}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default MyActivityList

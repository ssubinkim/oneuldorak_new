import { LunchIcon } from './LunchIcon'

type RecommendedLunchCardProps = {
  title: string
  meta: string
  badge?: string
  muted?: boolean
}

// 오늘의 도시락 추천 영역에 들어가는 메뉴 카드입니다.
export function RecommendedLunchCard({ title, meta, badge, muted = false }: RecommendedLunchCardProps) {
  return (
    <article className={muted ? 'recommend-card recommend-card--muted' : 'recommend-card'}>
      <div className="recommend-card__image">
        {badge && <span>{badge}</span>}
        <LunchIcon />
      </div>
      <div className="recommend-card__body">
        <h3>{title}</h3>
        <p>⏱ {meta}</p>
      </div>
    </article>
  )
}

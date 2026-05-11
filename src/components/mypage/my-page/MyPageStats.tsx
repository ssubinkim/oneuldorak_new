import './MyPageStats.css'

export type MyPageStatItem = {
  id: string
  value: string
  label: string
  highlight?: boolean
  clickable?: boolean
}

type MyPageStatsProps = {
  stats: MyPageStatItem[]
  onStatClick?: (stat: MyPageStatItem) => void
}

function MyPageStats({ stats, onStatClick }: MyPageStatsProps) {
  return (
    <div className="mypage-stats">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`mypage-stat-item${stat.clickable ? ' clickable' : ''}`}
          onClick={stat.clickable ? () => onStatClick?.(stat) : undefined}
        >
          <div className={`mypage-stat-num${stat.highlight ? ' highlight' : ''}`}>
            {stat.value}
          </div>
          <div className="mypage-stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default MyPageStats

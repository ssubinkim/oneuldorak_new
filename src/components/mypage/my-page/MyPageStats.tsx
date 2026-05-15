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
        <button
          type="button"
          key={stat.id}
          className={`mypage-stat-item${stat.clickable ? ' clickable' : ''}`}
          onClick={stat.clickable ? () => onStatClick?.(stat) : undefined}
          disabled={!stat.clickable}
        >
          <div className="mypage-stat-label">{stat.label}</div>
          <div className={`mypage-stat-num${stat.highlight ? ' highlight' : ''}`}>
            {stat.value}
          </div>
        </button>
      ))}
    </div>
  )
}

export default MyPageStats

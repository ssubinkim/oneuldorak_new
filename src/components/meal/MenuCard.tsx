import './MenuCard.css'

interface Props {
  emoji: string
  name: string
  ingredients: string
  time?: string
  day?: string
  subLabel?: string
}

function MenuCard({ emoji, name, ingredients, time, day, subLabel = '준비 재료' }: Props) {
  return (
    <div className="menu-card-wrapper">
      {day && <div className="menu-card-day">{day}</div>}
      <div className="menu-card">
        <div className="menu-card-emoji">{emoji}</div>
        <div className="menu-card-info">
          {time && <div className="menu-card-time">소요시간 : {time}</div>}
          <div className="menu-card-name">{name}</div>
          <div className="menu-card-label">{subLabel}</div>
          <div className="menu-card-ingredients">{ingredients}</div>
        </div>
      </div>
    </div>
  )
}

export default MenuCard

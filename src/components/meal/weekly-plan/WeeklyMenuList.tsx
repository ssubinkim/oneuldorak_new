import { weeklyMenuData } from '../mealData'
import broThinkImg from '../images/bro_think.png'
import './WeeklyMenuList.css'

interface Props {
  selectedDay: number
}

function usageBadgeClass(usage: number | null): string {
  if (usage === null) return 'badge-none'
  if (usage === 100) return 'badge-full'
  if (usage >= 80) return 'badge-high'
  if (usage >= 50) return 'badge-mid'
  return 'badge-low'
}

function WeeklyMenuList({ selectedDay }: Props) {
  return (
    <div className="weekly-menu-list">
      {weeklyMenuData.map(menu => {
        const isSelected = menu.date === selectedDay
        return (
          <div key={menu.date} className={`weekly-card${menu.status === 'thinking' ? ' weekly-card-thinking' : ''}`}>
            <div className={`weekly-day-box day-${isSelected ? 'selected' : menu.status}`}>
              <span className="weekly-day-name">{menu.day}</span>
              <span className="weekly-day-date">{menu.month}/{menu.date}</span>
            </div>

            <div className="weekly-img-wrapper">
              {menu.image ? (
                <img
                  className="weekly-img"
                  src={menu.image}
                  alt={menu.name}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
              ) : menu.status === 'thinking' ? (
                <img className="weekly-img" src={broThinkImg} alt="고민중" />
              ) : (
                <div className="weekly-img-empty" />
              )}
            </div>

            <div className="weekly-info">
              <p className="weekly-name">{menu.name}</p>
              <p className="weekly-time">
                <span className="weekly-clock">⏱</span>
                {menu.time ? ` 약 ${menu.time}` : ' 약   분'}
              </p>
              <span className={`usage-badge ${usageBadgeClass(menu.usage)}`}>
                활용도 {menu.usage !== null ? `${menu.usage}%` : ''}
              </span>
            </div>

            <span className="weekly-arrow">›</span>
          </div>
        )
      })}
    </div>
  )
}

export default WeeklyMenuList

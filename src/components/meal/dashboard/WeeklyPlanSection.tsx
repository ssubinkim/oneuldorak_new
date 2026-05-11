import { weeklyMenuData } from '../mealData'
import './WeeklyPlanSection.css'

const TODAY_DATE = 1

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="m5 3 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="2.5" width="15" height="14" rx="3" stroke="#333" strokeWidth="1.5" />
      <path d="M1.5 7h15" stroke="#333" strokeWidth="1.5" />
      <path d="M5.5 1v3M12.5 1v3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function usageBadgeStyle(usage: number | null): React.CSSProperties {
  if (usage === null) return { background: '#f0f0f0', color: '#bbb' }
  if (usage === 100) return { background: '#ffe6a1', color: '#7a5000' }
  if (usage === 90)  return { background: '#b4c9ff', color: '#2a4fa8' }
  if (usage >= 60)   return { background: '#FFDB78', color: '#7a5000' }
  return { background: '#ffd0d0', color: '#cc3333' }
}

type Props = { onMore?: () => void }

function WeeklyPlanSection({ onMore }: Props) {
  return (
    <section className="wps-section">
      <div className="wps-header">
        <CalendarIcon />
        <span className="wps-title">이번주 도시락 계획</span>
        <button className="wps-more-btn" onClick={onMore}>더보기 <ChevronRight /></button>
      </div>

      <div className="wps-scroll">
        {weeklyMenuData.map((menu) => {
          const isToday = menu.date === TODAY_DATE
          const hasMenu = menu.status !== 'thinking' && menu.image !== null
          return (
            <div
              key={menu.day}
              className={`wps-card${isToday ? ' wps-card--today' : ''}`}
            >
              <span className="wps-card-date">
                {menu.month}/{menu.date} {menu.day}
              </span>

              <span className="wps-card-name">
                {hasMenu ? menu.name : '메뉴추가'}
              </span>

              <div className="wps-card-img-wrap">
                {hasMenu ? (
                  <img
                    src={menu.image!}
                    alt={menu.name}
                    className="wps-card-img"
                  />
                ) : (
                  <span className="wps-card-add">+</span>
                )}
              </div>

              <span
                className="wps-card-badge"
                style={usageBadgeStyle(menu.usage)}
              >
                {menu.usage !== null ? `활용도 ${menu.usage}%` : '활용도 %'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WeeklyPlanSection

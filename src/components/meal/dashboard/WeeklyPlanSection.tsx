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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 11.6667V5.00002C17.5 4.55799 17.3244 4.13407 17.0118 3.82151C16.6993 3.50895 16.2754 3.33335 15.8333 3.33335H4.16667C3.72464 3.33335 3.30072 3.50895 2.98816 3.82151C2.67559 4.13407 2.5 4.55799 2.5 5.00002V16.6667C2.5 17.1087 2.67559 17.5326 2.98816 17.8452C3.30072 18.1578 3.72464 18.3334 4.16667 18.3334H10.8333M13.3333 1.66669V5.00002M6.66667 1.66669V5.00002M2.5 8.33335H17.5M13.3333 16.6667L15 18.3334L18.3333 15" stroke="#3C3C3C" strokeWidth="1.4" strokeLinecap="square"/>
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

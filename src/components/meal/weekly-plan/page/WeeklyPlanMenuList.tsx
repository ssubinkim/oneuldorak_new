import { ChevronRight, ClockIcon } from './WeeklyPlanIcons'
import { usageBadgeStyle } from './weeklyPlanConstants'
import blueThink from '../../common/images/blue_think 1.svg'

type WeeklyPlanMenuListProps = {
  month: number
  todayDate: number
  menus: {
    day: string
    date: number
    image: string | null
    name: string
    time: string | null
    status: string
    usage: number | null
  }[]
}

function WeeklyPlanMenuList({ month, todayDate, menus }: WeeklyPlanMenuListProps) {
  return (
    <div className="wpp-menu-list">
      {menus.map((menu) => {
        const isToday = menu.date === todayDate
        const isThinking = menu.status === 'thinking'

        return (
          <div key={menu.day} className="wpp-menu-card">
            <div className={`wpp-menu-label${isToday ? ' wpp-menu-label--today' : ''}`}>
              <span className="wpp-menu-label-day">{menu.day}</span>
              <span className="wpp-menu-label-date">{month}/{menu.date}</span>
            </div>

            <div className="wpp-menu-img-wrap">
              {menu.image ? <img src={menu.image} alt={menu.name} className="wpp-menu-img" /> : <div className="wpp-menu-img-empty"><img src={blueThink} alt="메뉴 없음" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>}
            </div>

            <div className="wpp-menu-info">
              <p className="wpp-menu-name">{menu.name}</p>
              {!isThinking && menu.time && (
                <p className="wpp-menu-time"><ClockIcon /> 약 {menu.time}</p>
              )}
              {isThinking ? (
                <button className="wpp-ai-btn">✦ AI 추천받기 &gt;</button>
              ) : (
                menu.usage !== null && (
                  <span className="wpp-menu-badge" style={usageBadgeStyle(menu.usage)}>
                    활용도 {menu.usage}%
                  </span>
                )
              )}
            </div>

            {!isThinking && <ChevronRight />}
          </div>
        )
      })}
    </div>
  )
}

export default WeeklyPlanMenuList

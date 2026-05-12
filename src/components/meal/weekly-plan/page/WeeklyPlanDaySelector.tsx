import { CircleCheckIcon } from './WeeklyPlanIcons'

type WeeklyPlanDaySelectorProps = {
  menus: {
    day: string
    date: number
    image: string | null
  }[]
  todayDate: number
}

function WeeklyPlanDaySelector({ menus, todayDate }: WeeklyPlanDaySelectorProps) {
  return (
    <div className="wpp-day-selector">
      {menus.map((menu) => {
        const isToday = menu.date === todayDate
        const hasMenu = menu.image !== null

        return (
          <div key={menu.day} className="wpp-day-item">
            <span className="wpp-day-label">{menu.day}</span>
            <div className={`wpp-day-card${isToday ? ' wpp-day-card--today' : ''}`}>
              <span className="wpp-day-num">{menu.date}</span>
              <div className="wpp-day-status">
                {hasMenu ? <CircleCheckIcon isToday={isToday} /> : <span className="wpp-day-dots">···</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WeeklyPlanDaySelector

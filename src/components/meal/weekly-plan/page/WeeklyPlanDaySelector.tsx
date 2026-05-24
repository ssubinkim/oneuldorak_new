import { getCalDate } from './weeklyPlanConstants'

type WeeklyPlanDaySelectorProps = {
  menus: {
    day: string
    date: number
    image: string | null
  }[]
  selectedDate: number
  onSelectDate: (date: number) => void
}

function WeeklyPlanDaySelector({ menus, selectedDate, onSelectDate }: WeeklyPlanDaySelectorProps) {
  return (
    <div className="wpp-day-selector">
      <div className="wpp-days">
        {menus.map((menu) => (
          <div
            key={menu.day}
            className={`wpp-day-item${menu.date === selectedDate ? ' wpp-day-item--active' : ''}`}
            onClick={() => onSelectDate(menu.date)}
          >
            <span className="wpp-day-label">{menu.day}</span>
            <span className="wpp-day-num">{getCalDate(menu.date)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyPlanDaySelector

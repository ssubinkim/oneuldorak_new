import { CalendarIcon } from './WeeklyPlanIcons'

type WeeklyPlanMonthRowProps = {
  year: number
  month: number
  onOpenCalendar: () => void
}

function WeeklyPlanMonthRow({ year, month, onOpenCalendar }: WeeklyPlanMonthRowProps) {
  return (
    <div className="wpp-month-row">
      <span className="wpp-month-text">{year}년 {month}월</span>
      <button className="cal-icon-btn" onClick={onOpenCalendar}>
        <CalendarIcon />
      </button>
    </div>
  )
}

export default WeeklyPlanMonthRow

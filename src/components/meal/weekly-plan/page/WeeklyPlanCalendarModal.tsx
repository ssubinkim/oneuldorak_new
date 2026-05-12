import { DAY_LABELS } from './weeklyPlanConstants'

type WeeklyPlanCalendarModalProps = {
  year: number
  month: number
  todayDate: number
  onClose: () => void
}

function WeeklyPlanCalendarModal({ year, month, todayDate, onClose }: WeeklyPlanCalendarModalProps) {
  const rawFirst = new Date(year, month - 1, 1).getDay()
  const firstOffset = rawFirst === 0 ? 6 : rawFirst - 1
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="cal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={(event) => event.stopPropagation()}>
        <div className="cal-header">
          <button className="cal-nav">&lt;</button>
          <span className="cal-title">{year}년 {month}월</span>
          <button className="cal-nav">&gt;</button>
        </div>

        <div className="cal-grid">
          {DAY_LABELS.map((label) => (
            <div key={label} className="cal-label">{label}</div>
          ))}

          {cells.map((day, index) => (
            <div
              key={index}
              className={`cal-day${day === todayDate ? ' cal-day--today' : ''}${day === null ? ' cal-day--empty' : ''}`}
            >
              {day ?? ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeeklyPlanCalendarModal

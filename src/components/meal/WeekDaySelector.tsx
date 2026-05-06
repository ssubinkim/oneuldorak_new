import './WeekDaySelector.css'

const weekDays = [
  { name: '월', date: 6 }, { name: '화', date: 7 },
  { name: '수', date: 8 }, { name: '목', date: 9 },
  { name: '금', date: 10 }, { name: '토', date: 11 }, { name: '일', date: 12 },
]

interface Props {
  selectedDay: number
  setSelectedDay: (day: number) => void
  calOpen: boolean
  setCalOpen: (open: boolean) => void
}

function WeekDaySelector({ selectedDay, setSelectedDay, calOpen, setCalOpen }: Props) {
  return (
    <div className="week-day-selector">
      <div className="month-header" onClick={() => setCalOpen(!calOpen)}>
        <span className="month-title">2026년 5월</span>
        <span className="cal-toggle">{calOpen ? '▲' : '▼'}</span>
      </div>

      {calOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-title">2026년 5월</div>
          <div className="calendar-placeholder">달력 컴포넌트</div>
        </div>
      )}

      <div className="day-buttons">
        {weekDays.map(d => (
          <button
            key={d.date}
            className="day-btn"
            onClick={() => setSelectedDay(d.date)}
          >
            <span className="day-name">{d.name}</span>
            <span className={`day-date ${selectedDay === d.date ? 'active' : ''}`}>
              {d.date}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WeekDaySelector

import './WeekDaySelector.css'

const STATUS_LABEL = {
  confirmed: '확정',
  thinking: '고민중',
  planned: '예정',
} as const

const weekDays = [
  { name: '월', date: 1, status: 'confirmed' as const },
  { name: '화', date: 2, status: 'thinking' as const },
  { name: '수', date: 3, status: 'planned' as const },
  { name: '목', date: 4, status: 'thinking' as const },
  { name: '금', date: 5, status: 'confirmed' as const },
  { name: '토', date: 6, status: 'planned' as const },
  { name: '일', date: 7, status: 'planned' as const },
]

const CAL_HEADERS = ['일', '월', '화', '수', '목', '금', '토']

// 2026년 5월 1일 = 금요일 (일=0 기준, 금=5 → 앞에 5칸 공백)
function buildMayWeeks(): (number | null)[][] {
  const cells: (number | null)[] = Array(5).fill(null)
  for (let d = 1; d <= 31; d++) cells.push(d)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

interface Props {
  selectedDay: number
  setSelectedDay: (day: number) => void
  calOpen: boolean
  setCalOpen: (open: boolean) => void
}

function WeekDaySelector({ selectedDay, setSelectedDay, calOpen, setCalOpen }: Props) {
  const weeks = buildMayWeeks()
  const now = new Date()
  const today = now.getFullYear() === 2026 && now.getMonth() === 4 ? now.getDate() : -1

  return (
    <div className="week-day-selector">
      <div className="month-header" onClick={() => setCalOpen(!calOpen)}>
        <span className="month-title">2026년 5월</span>
        <span className="cal-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="15" rx="2.5" stroke="#555" strokeWidth="1.5" fill="none" />
            <line x1="2" y1="7.5" x2="18" y2="7.5" stroke="#555" strokeWidth="1.5" />
            <line x1="6" y1="1.5" x2="6" y2="5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="1.5" x2="14" y2="5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      {calOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-title">2026년 5월</div>
          <div className="calendar-grid">
            <div className="cal-header-row">
              {CAL_HEADERS.map(h => (
                <span key={h} className="cal-header-cell">{h}</span>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="cal-week-row">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di] ?? null
                  const isSelected = day === selectedDay
                  const isToday = day === today
                  return (
                    <span
                      key={di}
                      className={[
                        'cal-day',
                        day ? 'cal-day-clickable' : '',
                        isSelected ? 'cal-day-selected' : '',
                        isToday && !isSelected ? 'cal-day-today' : '',
                      ].join(' ').trim()}
                      onClick={() => day && setSelectedDay(day)}
                    >
                      {day ?? ''}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
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
            <span className={`day-status status-${d.status}`}>
              {STATUS_LABEL[d.status]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WeekDaySelector

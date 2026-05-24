import { useState } from 'react'
import { DAY_LABELS, getCalDate, getCalMonth, YEAR as CUR_YEAR } from './weeklyPlanConstants'

const WEEK_DATES = Array.from({ length: 7 }, (_, i) => ({
  dayNum: i + 1,
  date: getCalDate(i + 1),
  month: getCalMonth(i + 1),
}))

type WeeklyPlanCalendarModalProps = {
  year: number
  month: number
  todayDate: number
  selectedDate: number
  onSelectDate: (dayNum: number) => void
  onClose: () => void
}

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function WeeklyPlanCalendarModal({ year, month, todayDate, selectedDate, onSelectDate, onClose }: WeeklyPlanCalendarModalProps) {
  const [viewYear, setViewYear] = useState(year)
  const [viewMonth, setViewMonth] = useState(month)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState(year)

  const rawFirst = new Date(viewYear, viewMonth - 1, 1).getDay()
  const firstOffset = rawFirst === 0 ? 6 : rawFirst - 1
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const handlePrevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
  }
  const handleNextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
  }

  const handlePickerSelect = (m: number) => {
    setViewYear(pickerYear)
    setViewMonth(m)
    setShowPicker(false)
  }

  const handleDayClick = (day: number) => {
    const clicked = new Date(viewYear, viewMonth - 1, day)
    const jsDay = clicked.getDay()
    const dayNum = jsDay === 0 ? 7 : jsDay
    onSelectDate(dayNum)
    onClose()
  }

  const selectedCalDate = getCalDate(selectedDate)
  const selectedCalMonth = getCalMonth(selectedDate)

  return (
    <div className="cal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cal-header">
          {showPicker ? (
            <button className="cal-nav" onClick={() => setShowPicker(false)} aria-label="닫기">✕</button>
          ) : (
            <button className="cal-nav" onClick={handlePrevMonth} aria-label="이전 달">
              <svg width="7" height="13" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}

          <button className="cal-title" onClick={() => { setPickerYear(viewYear); setShowPicker(p => !p) }}>
            {viewYear}년 {viewMonth}월 ▾
          </button>

          {!showPicker && (
            <button className="cal-nav" onClick={handleNextMonth} aria-label="다음 달">
              <svg width="7" height="13" viewBox="0 0 10 18" fill="none"><path d="M1 1L9 9L1 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
        </div>

        {showPicker ? (
          <div className="cal-picker">
            <div className="cal-picker-year-row">
              <button className="cal-nav" onClick={() => setPickerYear(y => y - 1)}>
                <svg width="7" height="13" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span className="cal-picker-year">{pickerYear}년</span>
              <button className="cal-nav" onClick={() => setPickerYear(y => y + 1)}>
                <svg width="7" height="13" viewBox="0 0 10 18" fill="none"><path d="M1 1L9 9L1 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className="cal-picker-months">
              {MONTHS.map((label, i) => {
                const m = i + 1
                const isSelected = pickerYear === viewYear && m === viewMonth
                return (
                  <button
                    key={m}
                    className={`cal-picker-month${isSelected ? ' cal-picker-month--active' : ''}`}
                    onClick={() => handlePickerSelect(m)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="cal-grid">
            {DAY_LABELS.map((label) => (
              <div key={label} className="cal-label">{label}</div>
            ))}
            {cells.map((day, i) => {
              const isToday = day === todayDate && viewMonth === month && viewYear === year
              const isSelected = day === selectedCalDate && viewMonth === selectedCalMonth && viewYear === CUR_YEAR
              const isThisWeek = day !== null && WEEK_DATES.some(w => w.date === day && w.month === viewMonth && viewYear === CUR_YEAR)
              const className = `cal-day${isToday ? ' cal-day--today' : ''}${isSelected ? ' cal-day--selected' : ''}${isThisWeek ? ' cal-day--this-week' : ''}${day === null ? ' cal-day--empty' : ''}`
              if (day !== null) {
                return (
                  <button key={i} type="button" className={className} onClick={() => handleDayClick(day)}>
                    {day}
                  </button>
                )
              }
              return <div key={i} className={className} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default WeeklyPlanCalendarModal

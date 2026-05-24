import { useState } from 'react'
import { DAY_LABELS } from './weeklyPlanConstants'

type WeeklyPlanCalendarModalProps = {
  year: number
  month: number
  todayDate: number
  onClose: () => void
}

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function WeeklyPlanCalendarModal({ year, month, todayDate, onClose }: WeeklyPlanCalendarModalProps) {
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
            {cells.map((day, i) => (
              <div
                key={i}
                className={`cal-day${day === todayDate && viewMonth === month && viewYear === year ? ' cal-day--today' : ''}${day === null ? ' cal-day--empty' : ''}`}
              >
                {day ?? ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WeeklyPlanCalendarModal

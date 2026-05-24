import { useEffect, useState } from 'react'
import { calcAttendanceStreak, loadAttendanceDates } from '../mypageAttendance'
import day1Off from '../images/day1_off.png'
import day1On from '../images/day1_on.png'
import day2Off from '../images/day2_off.png'
import day2On from '../images/day2_on.png'
import day3Off from '../images/day3_off.png'
import day3On from '../images/day3_on.png'
import day4Off from '../images/day4_off.png'
import day4On from '../images/day4_on.png'
import day5Off from '../images/day5_off.png'
import day5On from '../images/day5_on.png'
import day6Off from '../images/day6_off.png'
import day6On from '../images/day6_on.png'
import day7Off from '../images/day7_off.png'
import day7On from '../images/day7_on.png'
import './PointBottomSheet.css'
import './AttendanceStampModal.css'

type AttendanceStampModalProps = {
  open: boolean
  onClose: () => void
}

const DAY_IMAGES = [
  { off: day1Off, on: day1On },
  { off: day2Off, on: day2On },
  { off: day3Off, on: day3On },
  { off: day4Off, on: day4On },
  { off: day5Off, on: day5On },
  { off: day6Off, on: day6On },
  { off: day7Off, on: day7On },
]

function AttendanceStampModal({ open, onClose }: AttendanceStampModalProps) {
  const [streak, setStreak] = useState(0)
  const [displayedDaysInCycle, setDisplayedDaysInCycle] = useState(0)
  const [stampedDayIndex, setStampedDayIndex] = useState(-1)

  useEffect(() => {
    if (!open) return

    const nextStreak = calcAttendanceStreak(loadAttendanceDates())
    const nextDaysInCycle = nextStreak === 0 ? 0 : nextStreak % 7 === 0 ? 7 : nextStreak % 7
    const baseDaysInCycle = nextDaysInCycle > 0 ? nextDaysInCycle - 1 : 0

    setStreak(nextStreak)
    setDisplayedDaysInCycle(baseDaysInCycle)
    setStampedDayIndex(-1)

    const stampTimer = window.setTimeout(() => {
      setDisplayedDaysInCycle(nextDaysInCycle)
      setStampedDayIndex(nextDaysInCycle > 0 ? nextDaysInCycle - 1 : -1)
    }, 240)

    const closeTimer = window.setTimeout(onClose, 2300)

    return () => {
      window.clearTimeout(stampTimer)
      window.clearTimeout(closeTimer)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="attendance-stamp-modal" role="presentation" onClick={onClose}>
      <section
        className="attendance-stamp-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="출석 도장 완료"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`point-attendance-card attendance-stamp-modal__attendance-card${stampedDayIndex >= 0 ? ' is-stamping' : ''}`}>
          <div className="point-attendance-header">
            <span className="point-attendance-card-title">출석체크</span>
            {streak > 0 && (
              <span className="point-attendance-streak">{streak}일 연속 출석 중!🔥</span>
            )}
          </div>
          <div className="point-attendance-grid">
            {DAY_IMAGES.map((img, index) => {
              const isOn = index + 1 <= displayedDaysInCycle
              return (
                <div
                  key={index}
                  className={`point-attendance-day${index === 6 ? ' point-attendance-day--seven' : ''}${index === stampedDayIndex ? ' attendance-stamp-modal__day--stamped' : ''}`}
                >
                  <img
                    src={isOn ? img.on : img.off}
                    alt={`${index + 1}일차`}
                    className="point-attendance-day-img"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AttendanceStampModal

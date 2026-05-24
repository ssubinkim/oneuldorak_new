export const MYPAGE_ATTENDANCE_KEY = 'mypage_attendance_dates'
export const ATTENDANCE_STAMP_PENDING_KEY = 'oneuldorak:attendance-stamp-pending'
export type AttendanceStampPendingType = 'login' | 'signup' | 'unknown'

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function markAttendanceStampPending(type: 'login' | 'signup') {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(ATTENDANCE_STAMP_PENDING_KEY, type)
}

export function consumeAttendanceStampPending(): AttendanceStampPendingType | null {
  if (typeof window === 'undefined') return null
  const pending = window.sessionStorage.getItem(ATTENDANCE_STAMP_PENDING_KEY)
  if (!pending) return null

  window.sessionStorage.removeItem(ATTENDANCE_STAMP_PENDING_KEY)

  if (pending === 'login' || pending === 'signup') {
    return pending
  }

  // Backward compatibility for existing sessions that stored "true".
  if (pending === 'true') {
    return 'unknown'
  }

  return null
}

export function loadAttendanceDates(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MYPAGE_ATTENDANCE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function calcAttendanceStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  let streak = 0
  let checkDate = getTodayStr()
  while (dates.includes(checkDate)) {
    streak++
    const d = new Date(checkDate)
    d.setDate(d.getDate() - 1)
    checkDate = d.toISOString().slice(0, 10)
  }
  return streak
}

// isNew: true → 회원가입(1일차), false → 더미로그인(7일차), undefined → 일반(하루1번 자동)
export function initAttendance(isNew?: boolean): string[] {
  const today = getTodayStr()

  if (isNew === false) {
    const sevenDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().slice(0, 10)
    })
    localStorage.setItem(MYPAGE_ATTENDANCE_KEY, JSON.stringify(sevenDays))
    return sevenDays
  }

  if (isNew === true) {
    const newDates = [today]
    localStorage.setItem(MYPAGE_ATTENDANCE_KEY, JSON.stringify(newDates))
    return newDates
  }

  const dates = loadAttendanceDates()
  if (!dates.includes(today)) {
    const updated = [...dates, today]
    localStorage.setItem(MYPAGE_ATTENDANCE_KEY, JSON.stringify(updated))
    return updated
  }
  return dates
}

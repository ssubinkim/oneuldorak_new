export function BackIcon() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="15" rx="3" stroke="#767676" strokeWidth="1.5" />
      <path d="M2 8h16" stroke="#767676" strokeWidth="1.5" />
      <path d="M6 1v4M14 1v4" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CircleCheckIcon({ isToday }: { isToday: boolean }) {
  const color = isToday ? '#fff' : '#FFDB78'

  return (
    <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="11" stroke={color} strokeWidth="2" />
      <path d="M8 13l3.5 3.5 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5" stroke="#aaa" strokeWidth="1.2" />
      <path d="M6 3.5v2.5l1.5 1" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="m5 3 4 4-4 4" stroke="#767676" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

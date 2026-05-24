const _today = new Date()
const _jsDay = _today.getDay()

export const YEAR = _today.getFullYear()
export const MONTH = _today.getMonth() + 1
export const TODAY_DATE = _jsDay === 0 ? 7 : _jsDay

const _monday = new Date(_today)
_monday.setDate(_today.getDate() - (TODAY_DATE - 1))

export function getCalDate(dayNum: number): number {
  const d = new Date(_monday)
  d.setDate(_monday.getDate() + (dayNum - 1))
  return d.getDate()
}

export function getCalMonth(dayNum: number): number {
  const d = new Date(_monday)
  d.setDate(_monday.getDate() + (dayNum - 1))
  return d.getMonth() + 1
}

export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export function usageBadgeStyle(usage: number | null): React.CSSProperties {
  if (usage === null) return { background: '#f0f0f0', color: '#bbb' }
  if (usage === 100) return { background: '#ffe6a1', color: '#7a5000' }
  if (usage === 90) return { background: '#b4c9ff', color: '#2a4fa8' }
  if (usage >= 60) return { background: '#FFDB78', color: '#7a5000' }
  return { background: '#ffd0d0', color: '#cc3333' }
}

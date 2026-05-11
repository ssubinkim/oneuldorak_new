import './AttendanceCircles.css'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

export type DayData = { filled: boolean; label?: string }

type Props = { data: DayData[] }

export default function AttendanceCircles({ data }: Props) {
  return (
    <div className="attendance-row">
      {data.map((d, i) => (
        <div key={i} className="attendance-col">
          <span className="attendance-day-label">{DAYS[i]}</span>
          <div className={`attendance-circle ${d.filled ? 'filled' : d.label ? 'milestone' : 'empty'}`}>
            {d.label ?? ''}
          </div>
        </div>
      ))}
    </div>
  )
}

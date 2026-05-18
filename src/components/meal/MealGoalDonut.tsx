import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './MealGoalDonut.css'

type Props = {
  pct: number
  goalBarPct: number
}

function MealGoalDonut({ pct, goalBarPct }: Props) {
  const [animPct, setAnimPct] = useState(0)
  const [displayPct, setDisplayPct] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setAnimPct(eased * goalBarPct)
      setDisplayPct(Math.round(eased * pct))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pct, goalBarPct])

  const donutStyle = { '--goal-pct': `${animPct}%` } as CSSProperties & { '--goal-pct': string }

  return (
    <span className="meal-goal-donut" style={donutStyle}>
      <span>{displayPct}%</span>
    </span>
  )
}

export default MealGoalDonut

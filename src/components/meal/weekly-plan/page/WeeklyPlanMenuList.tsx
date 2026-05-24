import { useEffect, useRef } from 'react'
import { ChevronRight } from './WeeklyPlanIcons'
import AlarmIcon from '../../../../assets/icons/alarm.svg?react'
import { usageBadgeStyle, getCalDate, getCalMonth } from './weeklyPlanConstants'
import blueThink from '../../../../assets/food_mascot/blue_think.png'

type WeeklyPlanMenuListProps = {
  month: number
  selectedDate: number
  menus: {
    day: string
    date: number
    image: string | null
    name: string
    time: string | null
    status: string
    usage: number | null
  }[]
}

function WeeklyPlanMenuList({ selectedDate, menus }: WeeklyPlanMenuListProps) {
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const isFirst = selectedDate === menus[0]?.date
    if (isFirst) {
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = cardRefs.current[selectedDate]
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedDate])

  return (
    <div className="wpp-menu-list" ref={listRef}>
      {menus.map((menu) => {
        const isToday = menu.date === selectedDate
        const isThinking = menu.status === 'thinking'

        return (
          <div key={menu.day} className="wpp-menu-card" ref={(el) => { cardRefs.current[menu.date] = el }}>
            <div className={`wpp-menu-label${isToday ? ' wpp-menu-label--today' : ''}`}>
              <span className="wpp-menu-label-day">{menu.day}</span>
              <span className="wpp-menu-label-date">{getCalMonth(menu.date)}/{getCalDate(menu.date)}</span>
            </div>

            <div className="wpp-menu-body">
            <div className="wpp-menu-img-wrap">
              {menu.image ? <img src={menu.image} alt={menu.name} className="wpp-menu-img" /> : <div className="wpp-menu-img-empty"><img src={blueThink} alt="메뉴 없음" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>}
            </div>

            <div className="wpp-menu-info">
              <p className="wpp-menu-name">{menu.name}</p>
              {!isThinking && menu.time && (
                <p className="wpp-menu-time"><AlarmIcon width="14" height="14" /> {menu.time}</p>
              )}
              {isThinking ? (
                <button className="wpp-ai-btn">✦ AI 추천받기 &gt;</button>
              ) : (
                menu.usage !== null && (
                  <span className="wpp-menu-badge" style={usageBadgeStyle(menu.usage)}>
                    활용도 {menu.usage}%
                  </span>
                )
              )}
            </div>

            {!isThinking && <ChevronRight />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WeeklyPlanMenuList

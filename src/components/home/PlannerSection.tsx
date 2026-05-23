import { useState, useRef, useMemo, useCallback } from 'react'
import { weeklyMenuData } from '../meal/mealData'
import GraphIcon from '../../assets/icons/graph_icon.svg?react'
import AiIcon from '../../assets/icons/ai.svg?react'
import CalendarPlusIcon from '../../assets/icons/calendar-plus.svg?react'
import ChefHatIcon from '../../assets/icons/chef_hat.svg?react'
import AlarmIcon from '../../assets/icons/alarm.svg?react'
import './PlannerSection.css'

const jsDay = new Date().getDay()
const TODAY_DATE = jsDay === 0 ? 7 : jsDay
const WEEK_LEN = weeklyMenuData.length

function getVisibleDays(selectedDate: number) {
  const centerIdx = weeklyMenuData.findIndex(m => m.date === selectedDate)
  return Array.from({ length: 7 }, (_, i) => {
    const posOffset = i - 3 // -3 ~ +3
    const idx = ((centerIdx + posOffset) % WEEK_LEN + WEEK_LEN) % WEEK_LEN
    return { ...weeklyMenuData[idx], posOffset }
  })
}

type Props = {
  onDirectSelect?: () => void
}



type FlyDot = { startX: number; startY: number; endX: number; endY: number }

function PlannerSection({ onDirectSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE)
  const [slideSteps, setSlideSteps] = useState(0)
  const [toast, setToast] = useState(false)
  const [flyDot, setFlyDot] = useState<FlyDot | null>(null)
  const [calPulse, setCalPulse] = useState(false)
  const saveBtnRef = useRef<HTMLButtonElement>(null)
  const calBtnRef = useRef<HTMLButtonElement>(null)

  const handleSave = () => {
    const saveRect = saveBtnRef.current?.getBoundingClientRect()
    const calRect = calBtnRef.current?.getBoundingClientRect()

    if (saveRect && calRect) {
      setFlyDot({
        startX: saveRect.left + saveRect.width / 2,
        startY: saveRect.top + saveRect.height / 2,
        endX: calRect.left + calRect.width / 2,
        endY: calRect.top + calRect.height / 2,
      })
      setTimeout(() => {
        setFlyDot(null)
        setCalPulse(true)
        setTimeout(() => setCalPulse(false), 400)
      }, 620)
    }

    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }
  const selectedMenu = weeklyMenuData.find(m => m.date === selectedDate) ?? weeklyMenuData[0]
  const visibleDays = useMemo(() => getVisibleDays(selectedDate), [selectedDate])
  const daysInnerRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const dragStartX = useRef<number | null>(null)

  const handleDragStart = (x: number) => { dragStartX.current = x }
  const handleDragEnd = (x: number) => {
    if (dragStartX.current === null) return
    const delta = x - dragStartX.current
    dragStartX.current = null
    if (Math.abs(delta) < 40) return
    handleDayClick(delta < 0 ? 1 : -1)
  }

  const handleDayClick = useCallback((posOffset: number) => {
    if (posOffset === 0 || isAnimating.current) return
    isAnimating.current = true
    setSlideSteps(-posOffset)

    setTimeout(() => {
      const centerIdx = weeklyMenuData.findIndex(m => m.date === selectedDate)
      const newIdx = ((centerIdx + posOffset) % WEEK_LEN + WEEK_LEN) % WEEK_LEN

      // transition 잠깐 끄고 스냅
      if (daysInnerRef.current) daysInnerRef.current.style.transition = 'none'
      setSelectedDate(weeklyMenuData[newIdx].date)
      setSlideSteps(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (daysInnerRef.current) daysInnerRef.current.style.transition = ''
          isAnimating.current = false
        })
      })
    }, 250)
  }, [selectedDate])

  return (
    <section className="planner">
      <div className="planner__header">
        <div className="planner__title-wrap">
          <span className="planner__ai-badge">
            <AiIcon width="16" height="16" stroke="#FFC527" aria-hidden="true" />
            AI PICK
          </span>
          <h2 className="planner__title">이번 주 도시락 플래너</h2>
        </div>
        <button
          ref={calBtnRef}
          className={`planner__cal-btn${calPulse ? ' planner__cal-btn--pulse' : ''}`}
          aria-label="플래너 달력 열기"
          onClick={() => { window.location.hash = '#/meal-weekly-plan' }}
        >
          <CalendarPlusIcon width="22" height="22" stroke="#3C3C3C" aria-hidden="true" />
        </button>
      </div>

      <div
        className="planner__days-wrap"
        onMouseDown={e => handleDragStart(e.clientX)}
        onMouseUp={e => handleDragEnd(e.clientX)}
        onMouseLeave={() => { dragStartX.current = null }}
        onTouchStart={e => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
      >
        <div
          ref={daysInnerRef}
          className="planner__days"
          style={{ transform: `translateX(calc(${slideSteps} * 100% / 7))` }}
        >
          {visibleDays.map((menu, i) => (
            <button
              key={i}
              className={`planner__day${menu.posOffset === 0 ? ' planner__day--active' : ''}`}
              onClick={() => handleDayClick(menu.posOffset)}
            >
              <span className="planner__day-name">{menu.day}</span>
              <span className="planner__day-num">{menu.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="planner__card">
        <div className="planner__card-header">
          <div className="planner__today-label">
            <ChefHatIcon width="20" height="20" stroke="#3C3C3C" aria-hidden="true" />
            <span>Today</span>
          </div>
          <button
            className="planner__edit-btn"
            onClick={() => { window.location.hash = '#/meal-weekly-plan' }}
          >
            수정
          </button>
        </div>

        <div className="planner__menu-body">
            <img
              src={selectedMenu.image!}
              alt={selectedMenu.name}
              className="planner__menu-img"
            />
            <div className="planner__menu-info">
              <h3 className="planner__menu-name">{selectedMenu.name}</h3>
              {selectedMenu.usage !== null && (
                <span className="planner__usage-badge">내 재료 활용 {selectedMenu.usage}%</span>
              )}
              {/* <p className="planner__menu-desc">{selectedMenu.description}</p> */}
              <div className="planner__menu-meta">
                {selectedMenu.time && (
                  <span className="planner__meta-item">
                    <AlarmIcon width="14" height="14" color="#0248FF" />
                    {selectedMenu.time}
                  </span>
                )}
                {selectedMenu.savedAmount > 0 && (
                  <span className="planner__meta-item planner__meta-save">
                    <GraphIcon width="14" height="14" color="#EF5246" />
                    {selectedMenu.savedAmount.toLocaleString()}원 절약
                  </span>
                )}
              </div>
            </div>
          </div>

        <div className="planner__actions">
          <button
            className="planner__btn planner__btn--outline"
            onClick={onDirectSelect}
          >
            다른 메뉴 보기
          </button>
          <button
            ref={saveBtnRef}
            className="planner__btn planner__btn--primary"
            onClick={handleSave}
          >
            확인
          </button>
        </div>
      </div>

      {toast && (
        <div className="planner__toast">저장되었습니다 ✓</div>
      )}

      {flyDot && (
        <div
          className="planner__fly-dot"
          style={{
            '--start-x': `${flyDot.startX}px`,
            '--start-y': `${flyDot.startY}px`,
            '--end-x': `${flyDot.endX}px`,
            '--end-y': `${flyDot.endY}px`,
          } as React.CSSProperties}
        />
      )}
    </section>
  )
}

export default PlannerSection

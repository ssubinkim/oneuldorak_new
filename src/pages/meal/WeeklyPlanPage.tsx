import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { weeklyMenuData } from '../../components/meal/mealData'
import dorakcrewImg from '../../components/meal/images/dorak_walk.svg'
import '../../styles/Tailwind.css'
import './WeeklyPlanPage.css'

const YEAR = 2026
const MONTH = 5
const TODAY_DATE = 1
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

type Props = { onBack: () => void }

function BackIcon() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="15" rx="3" stroke="#aaa" strokeWidth="1.5" />
      <path d="M2 8h16" stroke="#aaa" strokeWidth="1.5" />
      <path d="M6 1v4M14 1v4" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CircleCheckIcon({ isToday }: { isToday: boolean }) {
  const color = isToday ? '#fff' : '#FFDB78'
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="11" stroke={color} strokeWidth="2" />
      <path d="M8 13l3.5 3.5 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5" stroke="#aaa" strokeWidth="1.2" />
      <path d="M6 3.5v2.5l1.5 1" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="m5 3 4 4-4 4" stroke="#ccc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function usageBadgeStyle(usage: number | null): React.CSSProperties {
  if (usage === null) return { background: '#f0f0f0', color: '#bbb' }
  if (usage === 100)  return { background: '#ffe6a1', color: '#7a5000' }
  if (usage === 90)   return { background: '#b4c9ff', color: '#2a4fa8' }
  if (usage >= 60)    return { background: '#FFDB78', color: '#7a5000' }
  return { background: '#ffd0d0', color: '#cc3333' }
}

/* ── 달력 모달 ─────────────────────────────────── */
function CalendarModal({ year, month, todayDate, onClose }: {
  year: number; month: number; todayDate: number; onClose: () => void
}) {
  // 해당 월의 첫째 날 요일 (월=0 … 일=6)
  const rawFirst = new Date(year, month - 1, 1).getDay()
  const firstOffset = rawFirst === 0 ? 6 : rawFirst - 1
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="cal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={e => e.stopPropagation()}>
        <div className="cal-header">
          <button className="cal-nav">&lt;</button>
          <span className="cal-title">{year}년 {month}월</span>
          <button className="cal-nav">&gt;</button>
        </div>
        <div className="cal-grid">
          {DAY_LABELS.map(d => (
            <div key={d} className="cal-label">{d}</div>
          ))}
          {cells.map((day, i) => (
            <div
              key={i}
              className={`cal-day${day === todayDate ? ' cal-day--today' : ''}${day === null ? ' cal-day--empty' : ''}`}
            >
              {day ?? ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 페이지 ────────────────────────────────────── */
function WeeklyPlanPage({ onBack }: Props) {
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-screen wpp-screen">
        <div className="wpp-scroll">

          {/* 헤더 */}
          <div className="wpp-header">
            <button className="wpp-back-btn" onClick={onBack} aria-label="뒤로가기">
              <BackIcon />
            </button>
            <span className="wpp-header-title">이번주 도시락 계획</span>
            <img src={dorakcrewImg} alt="" className="wpp-header-crew" />
          </div>

          {/* 콘텐츠 */}
          <div className="wpp-content">

            {/* 월 표시 */}
            <div className="wpp-month-row">
              <span className="wpp-month-text">{YEAR}년 {MONTH}월</span>
              <button className="cal-icon-btn" onClick={() => setShowCalendar(true)}>
                <CalendarIcon />
              </button>
            </div>

            {/* 날짜 선택 */}
            <div className="wpp-day-selector">
              {weeklyMenuData.map((menu) => {
                const isToday = menu.date === TODAY_DATE
                const hasMenu = menu.image !== null
                return (
                  <div key={menu.day} className="wpp-day-item">
                    <span className="wpp-day-label">{menu.day}</span>
                    <div className={`wpp-day-card${isToday ? ' wpp-day-card--today' : ''}`}>
                      <span className="wpp-day-num">{menu.date}</span>
                      <div className="wpp-day-status">
                        {hasMenu
                          ? <CircleCheckIcon isToday={isToday} />
                          : <span className="wpp-day-dots">···</span>
                        }
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 메뉴 리스트 */}
            <div className="wpp-menu-list">
              {weeklyMenuData.map((menu) => {
                const isToday = menu.date === TODAY_DATE
                const isThinking = menu.status === 'thinking'
                return (
                  <div key={menu.day} className="wpp-menu-card">
                    <div className={`wpp-menu-label${isToday ? ' wpp-menu-label--today' : ''}`}>
                      <span className="wpp-menu-label-day">{menu.day}</span>
                      <span className="wpp-menu-label-date">{MONTH}/{menu.date}</span>
                    </div>
                    <div className="wpp-menu-img-wrap">
                      {menu.image
                        ? <img src={menu.image} alt={menu.name} className="wpp-menu-img" />
                        : <div className="wpp-menu-img-empty" />
                      }
                    </div>
                    <div className="wpp-menu-info">
                      <p className="wpp-menu-name">{menu.name}</p>
                      {!isThinking && menu.time && (
                        <p className="wpp-menu-time"><ClockIcon /> 약 {menu.time}</p>
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
                )
              })}
            </div>

          </div>
        </div>

        {/* 달력 모달 — wpp-scroll 바깥에 배치해 overflow clip 방지 */}
        {showCalendar && (
          <CalendarModal
            year={YEAR}
            month={MONTH}
            todayDate={TODAY_DATE}
            onClose={() => setShowCalendar(false)}
          />
        )}

        <BottomNav />
      </div>
    </div>
  )
}

export default WeeklyPlanPage

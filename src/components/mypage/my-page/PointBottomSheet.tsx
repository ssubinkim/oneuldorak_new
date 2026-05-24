import { useState, useEffect } from 'react'
import BottomSheet from '../common/BottomSheet'
import { usePointBalance, usePointHistory, usePointProfile } from '../../common/usePoints'
import { loadAttendanceDates, calcAttendanceStreak } from '../mypageAttendance'
import pointIconImg from '../images/point-icon.svg'
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

const DAY_IMAGES = [
  { off: day1Off, on: day1On },
  { off: day2Off, on: day2On },
  { off: day3Off, on: day3On },
  { off: day4Off, on: day4On },
  { off: day5Off, on: day5On },
  { off: day6Off, on: day6On },
  { off: day7Off, on: day7On },
]

const ACTIVITY_POINTS = [
  { label: '게시글 작성', point: '+3P' },
  { label: '댓글 작성', point: '+1P' },
  { label: '쇼핑 후 리뷰 작성', point: '+10P' },
  { label: '인기글 등록', point: '+5P' },
  { label: '출석 완료 보상', point: '+10P' },
  { label: '카카오톡 공유', point: '+10P' },
]

const DEFAULT_HISTORY = [
  { label: '게시글 작성', point: '+3P' },
  { label: '댓글 작성', point: '+1P' },
  { label: '출석 완료 보상', point: '+10P' },
  { label: '쇼핑 후 리뷰 작성', point: '+10P' },
  { label: '인기글 등록', point: '+5P' },
  { label: '댓글 작성', point: '+1P' },
  { label: '카카오톡 공유', point: '+10P' },
  { label: '게시글 작성', point: '+3P' },
  { label: '선착순 투표 작성', point: '+3P' },
  { label: '댓글 작성', point: '+1P' },
]

function formatPoint(point: number) {
  return `+${point}P`
}

function toDisplayNumber(value: number) {
  return value.toLocaleString()
}

type Tab = 'history' | 'attendance'

type Props = {
  open: boolean
  onClose: () => void
  totalPoints?: number
  monthlyPoints?: number
}

export default function PointBottomSheet({ open, onClose, totalPoints = 245, monthlyPoints = 133 }: Props) {
  const [tab, setTab] = useState<Tab>('history')
  const [attendanceDates, setAttendanceDates] = useState<string[]>([])
  const [showActivityInfo, setShowActivityInfo] = useState(false)
  const livePointBalance = usePointBalance()
  const pointProfile = usePointProfile()
  const pointHistory = usePointHistory()
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const mappedPointHistory = pointHistory.map((item) => ({ label: item.label, point: formatPoint(item.point) }))
  const historyItems = pointProfile === 'signup'
    ? mappedPointHistory
    : [...mappedPointHistory, ...DEFAULT_HISTORY]
  const signupTotalPoints = pointHistory.reduce((sum, item) => sum + item.point, 0)
  const signupMonthlyPoints = pointHistory.reduce((sum, item) => {
    const createdAtDate = new Date(item.createdAt)
    const isSameMonth = createdAtDate.getFullYear() === now.getFullYear() && createdAtDate.getMonth() === now.getMonth()

    return isSameMonth ? sum + item.point : sum
  }, 0)
  const displayedTotalPoints = pointProfile === 'signup'
    ? signupTotalPoints
    : totalPoints ?? livePointBalance.totalPoints
  const displayedMonthlyPoints = pointProfile === 'signup'
    ? signupMonthlyPoints
    : monthlyPoints ?? livePointBalance.monthlyPoints

  useEffect(() => {
    if (!open) {
      setShowActivityInfo(false)
      setTab('history')
      return
    }
    setAttendanceDates(loadAttendanceDates())
  }, [open])

  const streak = calcAttendanceStreak(attendanceDates)
  const daysInCycle = streak === 0 ? 0 : streak % 7 === 0 ? 7 : streak % 7

  return (
    <BottomSheet open={open} onClose={onClose} className="point-bs">
      <div className="point-sheet">
        <h2 className="point-sheet-title">
          {tab === 'history' ? '포인트 적립 내역' : '출석체크'}
        </h2>
        <p className="point-sheet-sub">
          {tab === 'history' ? '포인트 내역을 정리해서 보여드려요.' : '출석활동으로 포인트를 모아요.'}
        </p>

        <div className="point-sheet-tabs">
          <button
            className={`point-sheet-tab${tab === 'history' ? ' active' : ''}`}
            onClick={() => setTab('history')}
          >
            적립내역
          </button>
          <button
            className={`point-sheet-tab${tab === 'attendance' ? ' active' : ''}`}
            onClick={() => setTab('attendance')}
          >
            출석체크
          </button>
        </div>

        <div className="point-tab-container">
          {/* 적립내역 탭 (기준 높이) */}
          <div className={`point-history${tab === 'history' ? '' : ' hidden'}`}>
            <div className="point-history-card">
              <button
                type="button"
                className="point-info-btn"
                onClick={() => setShowActivityInfo(true)}
                aria-label="포인트 적립 안내"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </button>
              <div className="point-history-card-top">
                <img src={pointIconImg} alt="" className="point-history-coin" aria-hidden="true" />
                <div>
                  <div className="point-history-label-row">
                    <span className="point-history-card-label">나의 포인트</span>
                  </div>
                  <div className="point-history-total">{toDisplayNumber(displayedTotalPoints)} <span>p</span></div>
                </div>
              </div>
              <div className="point-history-monthly">
                <span>{currentMonth}월에 받은 포인트</span>
                <span className="point-history-monthly-val">{toDisplayNumber(displayedMonthlyPoints)}P</span>
              </div>
            </div>

            <div className="point-history-section-title">적립내역</div>
            <div className="point-history-list">
              {historyItems.length > 0 ? (
                historyItems.map((item, i) => (
                  <div key={`${item.label}-${i}`} className="point-history-row">
                    <span className="point-history-row-label">{item.label}</span>
                    <span className="point-history-row-val">{item.point}</span>
                  </div>
                ))
              ) : (
                <div className="point-history-row">
                  <span className="point-history-row-label">아직 적립 내역이 없어요</span>
                  <span className="point-history-row-val">-</span>
                </div>
              )}
            </div>
          </div>

          {/* 출석체크 탭 */}
          <div className={`point-attendance${tab === 'attendance' ? '' : ' hidden'}`}>
            <div className="point-attendance-card">
              <div className="point-attendance-header">
                <span className="point-attendance-card-title">출석체크</span>
                {streak > 0 && (
                  <span className="point-attendance-streak">{streak}일 연속 출석 중!🔥</span>
                )}
              </div>
              <div className="point-attendance-grid">
                {DAY_IMAGES.map((img, idx) => {
                  const isOn = idx + 1 <= daysInCycle
                  return (
                    <div
                      key={idx}
                      className={`point-attendance-day${idx === 6 ? ' point-attendance-day--seven' : ''}`}
                    >
                      <img
                        src={isOn ? img.on : img.off}
                        alt={`${idx + 1}일차`}
                        className="point-attendance-day-img"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 활동별 적립 안내 오버레이 */}
        {showActivityInfo && (
          <div
            className="point-activity-overlay"
            onClick={() => setShowActivityInfo(false)}
          >
            <div
              className="point-activity-info-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="point-activity-title">활동별 적립</div>
              {ACTIVITY_POINTS.map((item) => (
                <div key={item.label} className="point-activity-row">
                  <span>{item.label}</span>
                  <span className="point-activity-val">{item.point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

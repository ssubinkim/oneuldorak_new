import { useEffect, useState } from 'react'
import BottomNav from '../../common/layout/BottomNav'
import Header from '../../common/layout/Header'
import '../../../styles/Tailwind.css'
import AttendanceCircles from './AttendanceCircles'
import type { DayData } from './AttendanceCircles'
import GoalBottomSheet from './GoalBottomSheet'
import PointBottomSheet from './PointBottomSheet'
import profileImg from '../images/profile 1.svg?url'
import LikePageView from '../like-page/LikePageView'
import './MyPage.css'

const ATTENDANCE: DayData[] = [
  { filled: true, label: '1P' },
  { filled: true, label: '1P' },
  { filled: false },
  { filled: false, label: '3P' },
  { filled: false },
  { filled: false },
  { filled: false, label: '10P' },
]

const GOAL = { current: 72000, target: 100000 }
const TOTAL_POINTS = 245
const MONTHLY_POINTS = 133

const MENU_SECTIONS = [
  {
    title: '스토어',
    items: [['구매 내역', '정기 배송']],
  },
  {
    title: '멤버십',
    items: [['멤버십 혜택', '구독 현황']],
  },
  {
    title: '설정 / 관리',
    items: [
      ['계정 설정', '알림 설정'],
      ['구독·결제', '앱 환경 설정'],
      ['약관·정책', '고객지원 센터'],
    ],
  },
]

function MyPageView() {
  const [goalOpen, setGoalOpen] = useState(false)
  const [pointOpen, setPointOpen] = useState(false)
  const [pointSheetKey, setPointSheetKey] = useState(0)
  const [showLikes, setShowLikes] = useState(false)

  const pct = Math.round((GOAL.current / GOAL.target) * 100)
  const [goalBarPct, setGoalBarPct] = useState(0)

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setGoalBarPct(pct)
    })

    return () => cancelAnimationFrame(rafId)
  }, [pct])

  if (showLikes) {
    return <LikePageView onBack={() => setShowLikes(false)} />
  }

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        <div className="page-scroll">
          <div className="mypage">

            {/* 프로필 */}
            <div className="mypage-profile">
              <div className="mypage-avatar">
                <img src={profileImg} alt="프로필" />
              </div>
              <div>
                <div className="mypage-user-level">LV.재료좀줌</div>
                <div className="mypage-user-name">도시락 러버</div>
                <div className="mypage-user-email">hyseah@gmail.com</div>
              </div>
            </div>

            {/* 통계 */}
            <div className="mypage-stats">
              <div
                className="mypage-stat-item clickable"
                onClick={() => setShowLikes(true)}
              >
                <div className="mypage-stat-num highlight">9</div>
                <div className="mypage-stat-label">좋아요</div>
              </div>
              {([['6', '내 게시글'], ['8', '내 댓글']] as const).map(([num, label]) => (
                <div key={label} className="mypage-stat-item">
                  <div className="mypage-stat-num">{num}</div>
                  <div className="mypage-stat-label">{label}</div>
                </div>
              ))}
            </div>

            {/* 이번달 절약 목표 */}
            <div className="mypage-card">
              <div className="mypage-goal-header">
                <span className="mypage-goal-title">이번달 절약 목표</span>
                <button className="mypage-goal-edit" onClick={() => setGoalOpen(true)}>수정</button>
              </div>
              <div className="mypage-goal-amount">
                <strong>현재 지출 {GOAL.current.toLocaleString()}원</strong>
                <span className="sub-text"> /목표 {GOAL.target.toLocaleString()}원</span>
              </div>
              <div className="mypage-goal-bar-bg">
                <div className="mypage-goal-bar-fill" style={{ width: `${goalBarPct}%` }} />
              </div>
              <div className="mypage-goal-percent-text">목표금액의 {pct}% 소비 하셨어요!</div>
            </div>

            {/* 나의 포인트 */}
            <div className="mypage-card">
              <div className="mypage-point-header">
                <span className="mypage-point-title">나의 포인트</span>
                <span className="mypage-point-amount">{TOTAL_POINTS}P</span>
              </div>
              <AttendanceCircles data={ATTENDANCE} />
              <div className="mypage-point-stamp-info">출석도장 3/7</div>
              <button
                className="mypage-point-btn"
                onClick={() => {
                  setPointSheetKey((prev) => prev + 1)
                  setPointOpen(true)
                }}
              >
                포인트 내역
                <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 3.5 4 4.5-4 4.5" />
                </svg>
              </button>
            </div>

            {/* 메뉴 */}
            <div className="mypage-menus">
              {MENU_SECTIONS.map((section) => (
                <div key={section.title} className="mypage-menu-section">
                  <div className="mypage-menu-title">{section.title}</div>
                  {section.items.map((row, i) => (
                    <div key={i} className="mypage-menu-row">
                      {row.map((item) => (
                        <div key={item} className="mypage-menu-item">{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>

        <GoalBottomSheet open={goalOpen} onClose={() => setGoalOpen(false)} />
        <PointBottomSheet
          key={pointSheetKey}
          open={pointOpen}
          onClose={() => setPointOpen(false)}
          totalPoints={TOTAL_POINTS}
          monthlyPoints={MONTHLY_POINTS}
        />

        <BottomNav />
      </div>
    </div>
  )
}

export default MyPageView

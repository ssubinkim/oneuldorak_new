import { useEffect, useState } from 'react'
import type { DayData } from './AttendanceCircles'
import GoalBottomSheet from './GoalBottomSheet'
import MyPageGoalCard from './MyPageGoalCard'
import MyPageMenuSections from './MyPageMenuSections'
import MyPagePointCard from './MyPagePointCard'
import MyPageProfile from './MyPageProfile'
import MyPageShell from './MyPageShell'
import MyPageStats from './MyPageStats'
import type { MyPageStatItem } from './MyPageStats'
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

const STATS: MyPageStatItem[] = [
  { id: 'likes', value: '9', label: '좋아요', highlight: true, clickable: true },
  { id: 'posts', value: '6', label: '내 게시글' },
  { id: 'comments', value: '8', label: '내 댓글' },
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
    <MyPageShell>
      <div className="page-scroll">
        <div className="mypage">
          <MyPageProfile profileImg={profileImg} />
          <MyPageStats
            stats={STATS}
            onStatClick={(stat) => {
              if (stat.id === 'likes') setShowLikes(true)
            }}
          />
          <MyPageGoalCard
            goal={GOAL}
            pct={pct}
            goalBarPct={goalBarPct}
            onEdit={() => setGoalOpen(true)}
          />
          <MyPagePointCard
            attendance={ATTENDANCE}
            totalPoints={TOTAL_POINTS}
            onPointHistoryClick={() => {
              setPointSheetKey((prev) => prev + 1)
              setPointOpen(true)
            }}
          />
          <MyPageMenuSections />
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
    </MyPageShell>
  )
}

export default MyPageView

import { useEffect, useState } from 'react'
import type { DayData } from '../../components/mypage/my-page/AttendanceCircles'
import { usePointBalance } from '../../components/common/usePoints'
import GoalBottomSheet from '../../components/mypage/my-page/GoalBottomSheet'
import MyPageGoalCard from '../../components/mypage/my-page/MyPageGoalCard'
import MyPageMenuSections from '../../components/mypage/my-page/MyPageMenuSections'
import MyPagePointCard from '../../components/mypage/my-page/MyPagePointCard'
import MyPageProfile from '../../components/mypage/my-page/MyPageProfile'
import MyPageShell from '../../components/mypage/my-page/MyPageShell'
import MyPageStats from '../../components/mypage/my-page/MyPageStats'
import type { MyPageStatItem } from '../../components/mypage/my-page/MyPageStats'
import PointBottomSheet from '../../components/mypage/my-page/PointBottomSheet'
import profileImg from '../../assets/icons/profile 1.svg?url'
import '../../components/mypage/my-page/MyPage.css'

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

const STATS: MyPageStatItem[] = [
  { id: 'likes', value: '9', label: '좋아요', highlight: true, clickable: true },
  { id: 'posts', value: '6', label: '내 게시글' },
  { id: 'comments', value: '8', label: '내 댓글' },
]

export default function MyPage() {
  const [goalOpen, setGoalOpen] = useState(false)
  const [pointOpen, setPointOpen] = useState(false)
  const [pointSheetKey, setPointSheetKey] = useState(0)
  const { totalPoints, monthlyPoints } = usePointBalance()

  const pct = Math.round((GOAL.current / GOAL.target) * 100)
  const [goalBarPct, setGoalBarPct] = useState(0)

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setGoalBarPct(pct)
    })

    return () => cancelAnimationFrame(rafId)
  }, [pct])

  return (
    <MyPageShell>
      <div className="page-scroll">
        <div className="mypage">
          <MyPageProfile profileImg={profileImg} />
          <MyPageStats
            stats={STATS}
            onStatClick={(stat) => {
              if (stat.id === 'likes') window.location.hash = '#/mypage-likes'
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
            totalPoints={totalPoints}
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
        totalPoints={totalPoints}
        monthlyPoints={monthlyPoints}
      />
    </MyPageShell>
  )
}

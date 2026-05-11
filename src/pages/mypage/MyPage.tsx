<<<<<<< HEAD
import MyPageView from '../../components/mypage/my-page/MyPageView'

export default function MyPage() {
  return <MyPageView />
=======
import { useEffect, useState } from 'react'
import type { DayData } from '../../components/mypage/my-page/AttendanceCircles'
import GoalBottomSheet from '../../components/mypage/my-page/GoalBottomSheet'
import MyPageGoalCard from '../../components/mypage/my-page/MyPageGoalCard'
import MyPageMenuSections from '../../components/mypage/my-page/MyPageMenuSections'
import MyPagePointCard from '../../components/mypage/my-page/MyPagePointCard'
import MyPageProfile from '../../components/mypage/my-page/MyPageProfile'
import MyPageShell from '../../components/mypage/my-page/MyPageShell'
import MyPageStats from '../../components/mypage/my-page/MyPageStats'
import type { MyPageStatItem } from '../../components/mypage/my-page/MyPageStats'
import PointBottomSheet from '../../components/mypage/my-page/PointBottomSheet'
import profileImg from './images/profile 1.svg?url'
import LikePage from './LikePage'
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

function MyPage() {
  const [goalOpen, setGoalOpen] = useState(false)
  const [pointOpen, setPointOpen] = useState(false)
  const [pointSheetKey, setPointSheetKey] = useState(0)
  const [showLikes, setShowLikes] = useState(false)
  const [goalBarPct, setGoalBarPct] = useState(0)

  const pct = Math.round((GOAL.current / GOAL.target) * 100)

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setGoalBarPct(pct)
    })

    return () => cancelAnimationFrame(rafId)
  }, [pct])

  if (showLikes) {
    return <LikePage onBack={() => setShowLikes(false)} />
  }

  return (
    <MyPageShell>
      <div className="page-scroll">
        <div className="mypage">
          {/* MyPageProfile: 프로필 이미지, 레벨, 이름, 이메일 영역 */}
          <MyPageProfile profileImg={profileImg} />
          {/* MyPageStats: 좋아요, 내 게시글, 내 댓글 통계 영역 */}
          <MyPageStats
            stats={STATS}
            onStatClick={(stat) => {
              if (stat.id === 'likes') setShowLikes(true)
            }}
          />
          {/* MyPageGoalCard: 이번달 절약 목표 카드 */}
          <MyPageGoalCard
            goal={GOAL}
            pct={pct}
            goalBarPct={goalBarPct}
            onEdit={() => setGoalOpen(true)}
          />
          {/* MyPagePointCard: 포인트, 출석도장, 포인트 내역 버튼 카드 */}
          <MyPagePointCard
            attendance={ATTENDANCE}
            totalPoints={TOTAL_POINTS}
            onPointHistoryClick={() => {
              setPointSheetKey((prev) => prev + 1)
              setPointOpen(true)
            }}
          />
          {/* MyPageMenuSections: 스토어, 멤버십, 설정/관리 메뉴 목록 */}
          <MyPageMenuSections />
        </div>
      </div>

      {/* GoalBottomSheet: 절약 목표 수정 바텀시트 */}
      <GoalBottomSheet open={goalOpen} onClose={() => setGoalOpen(false)} />
      {/* PointBottomSheet: 포인트 내역 바텀시트 */}
      <PointBottomSheet
        key={pointSheetKey}
        open={pointOpen}
        onClose={() => setPointOpen(false)}
        totalPoints={TOTAL_POINTS}
        monthlyPoints={MONTHLY_POINTS}
      />
    </MyPageShell>
  )
>>>>>>> 75aefe0cca3d6adbf3468ec56f7367e08164d744
}

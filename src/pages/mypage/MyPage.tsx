import { useEffect, useState } from 'react'
import { usePointBalance } from '../../components/common/usePoints'
import { useUserProfile } from '../../components/common/useUserProfile'
import GoalBottomSheet from '../../components/mypage/my-page/GoalBottomSheet'
import MyPageGoalCard from '../../components/mypage/my-page/MyPageGoalCard'
import MyPageMenuSections from '../../components/mypage/my-page/MyPageMenuSections'
import MyPagePointCard from '../../components/mypage/my-page/MyPagePointCard'
import MyPageProfile from '../../components/mypage/my-page/MyPageProfile'
import MyPageShell from '../../components/mypage/my-page/MyPageShell'
import MyPageStats from '../../components/mypage/my-page/MyPageStats'
import type { MyPageStatItem } from '../../components/mypage/my-page/MyPageStats'
import PointBottomSheet from '../../components/mypage/my-page/PointBottomSheet'
import { getMyPageActivityCounts } from '../../components/mypage/mypageReactionData'
import arrowLeftIcon from '../../assets/icons/arrow_left.svg'
import bellIcon from '../../assets/icons/bell_icon.svg'
import profileImg from '../../assets/icons/profile 1.svg?url'
import '../../components/mypage/my-page/MyPage.css'

export default function MyPage() {
  const [goalOpen, setGoalOpen] = useState(false)
  const [goal, setGoal] = useState({ current: 72000, target: 100000 })
  const [pointOpen, setPointOpen] = useState(false)
  const [pointSheetKey, setPointSheetKey] = useState(0)
  const { email } = useUserProfile()
  const { totalPoints, monthlyPoints } = usePointBalance()
  const activityCounts = getMyPageActivityCounts(email)
  const stats: MyPageStatItem[] = [
    { id: 'likes', value: String(activityCounts.likes), label: '좋아요', highlight: true, clickable: true },
    { id: 'posts', value: String(activityCounts.posts), label: '게시글' },
    { id: 'comments', value: String(activityCounts.comments), label: '댓글' },
  ]

  const pct = Math.round((goal.current / goal.target) * 100)
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
          <header className="mypage-topbar">
            <button type="button" className="mypage-topbar__button" aria-label="뒤로가기" onClick={() => window.history.back()}>
              <img src={arrowLeftIcon} alt="" aria-hidden="true" />
            </button>
            <h1>마이페이지</h1>
            <button type="button" className="mypage-topbar__button" aria-label="알림">
              <img src={bellIcon} alt="" aria-hidden="true" />
            </button>
          </header>

          <section className="mypage-profile-card" aria-label="내 프로필 요약">
            <MyPageProfile profileImg={profileImg} />
            <MyPageStats
              stats={stats}
              onStatClick={(stat) => {
                if (stat.id === 'likes') window.location.hash = '#/mypage-likes'
              }}
            />
          </section>

          <MyPageGoalCard
            goal={goal}
            pct={pct}
            goalBarPct={goalBarPct}
            onEdit={() => setGoalOpen(true)}
          />
          <MyPagePointCard
            totalPoints={totalPoints}
            onPointHistoryClick={() => {
              setPointSheetKey((prev) => prev + 1)
              setPointOpen(true)
            }}
          />
          <MyPageMenuSections />
        </div>
      </div>

      <GoalBottomSheet
        open={goalOpen}
        onClose={() => setGoalOpen(false)}
        goal={goal}
        onSave={(newGoal) => { setGoal(newGoal); setGoalOpen(false) }}
      />
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

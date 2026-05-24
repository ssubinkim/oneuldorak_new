import { useEffect, useState } from 'react'
import { readOnboardingAnswers } from '../../components/common/aiDataHub'
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
import { NOTIFICATIONS } from '../../components/mypage/notification/notificationData'
import { hasUnreadNotifications } from '../../components/mypage/notification/notificationState'
import bellIcon from '../../assets/icons/bell_icon.svg'
import profileImg from '../../assets/icons/profile 1.svg?url'
import '../../components/mypage/my-page/MyPage.css'

const DEFAULT_GOAL = { current: 72000, target: 100000 }
const DEFAULT_GOAL_PROGRESS_RATIO = DEFAULT_GOAL.current / DEFAULT_GOAL.target

function parseBudgetWon(value: unknown) {
  if (typeof value !== 'string') return null

  const digits = value.replace(/[^0-9]/g, '')
  if (!digits) return null

  const parsed = parseInt(digits, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function getInitialGoalFromOnboarding() {
  const onboardingAnswers = readOnboardingAnswers()
  if (!onboardingAnswers || typeof onboardingAnswers !== 'object') {
    return DEFAULT_GOAL
  }

  const budgetAnswer = (onboardingAnswers as Record<string, unknown>).budget
  const parsedBudget = parseBudgetWon(budgetAnswer)
  if (!parsedBudget) {
    return DEFAULT_GOAL
  }

  return {
    target: parsedBudget,
    current: Math.min(parsedBudget, Math.round(parsedBudget * DEFAULT_GOAL_PROGRESS_RATIO)),
  }
}

export default function MyPage() {
  const [goalOpen, setGoalOpen] = useState(false)
  const [goal, setGoal] = useState(getInitialGoalFromOnboarding)
  const [pointOpen, setPointOpen] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('profile_saved') === 'true') {
      sessionStorage.removeItem('profile_saved')
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 2000)
    }
  }, [])
  const { email, isNew, avatar } = useUserProfile()
  const notificationIds = NOTIFICATIONS.map(n => n.id)
  const [hasUnread, setHasUnread] = useState(() => !isNew && hasUnreadNotifications(notificationIds))

  useEffect(() => {
    const check = () => setHasUnread(!isNew && hasUnreadNotifications(notificationIds))
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [isNew])

  const { totalPoints, monthlyPoints } = usePointBalance()
  const activityCounts = getMyPageActivityCounts(email)
  const stats: MyPageStatItem[] = [
    { id: 'likes', value: String(activityCounts.likes), label: '좋아요', highlight: true, clickable: true },
    { id: 'posts', value: String(activityCounts.posts), label: '게시글', highlight: true, clickable: true },
    { id: 'comments', value: String(activityCounts.comments), label: '댓글', highlight: true, clickable: true },
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
      {showSavedToast && (
        <div className="mypage-saved-toast">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          저장이 완료되었어요!
        </div>
      )}
      <div className="page-scroll">
        <div className="mypage">
          <header className="mypage-topbar">
            <h1>마이페이지</h1>
            <button type="button" className="mypage-topbar__button mypage-bell-btn" aria-label="알림" onClick={() => { window.location.hash = '#/mypage-notification' }}>
              <img src={bellIcon} alt="" aria-hidden="true" width={22} height={22} loading="eager" decoding="sync" fetchPriority="high" />
              {hasUnread && <span className="mypage-bell-badge" />}
            </button>
          </header>

          <section className="mypage-profile-card" aria-label="내 프로필 요약">
            <button type="button" className="mypage-profile-edit-btn" onClick={() => { window.location.hash = '#/mypage-profile-edit' }}>수정하기</button>
            <MyPageProfile profileImg={avatar ?? profileImg} />
            <MyPageStats
              stats={stats}
              onStatClick={(stat) => {
                if (stat.id === 'likes') window.location.hash = '#/mypage-likes?tab=post'
                if (stat.id === 'posts') window.location.hash = '#/mypage-posts'
                if (stat.id === 'comments') window.location.hash = '#/mypage-comments'
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
            onPointHistoryClick={() => setPointOpen(true)}
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
        open={pointOpen}
        onClose={() => setPointOpen(false)}
        totalPoints={totalPoints}
        monthlyPoints={monthlyPoints}
      />
    </MyPageShell>
  )
}

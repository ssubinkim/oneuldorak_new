import { useEffect, useMemo, useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { MY_ACTIVITY_CHANGED_EVENT } from '../../components/common/myActivityEvents'
import { useUserProfile } from '../../components/common/useUserProfile'
import MyActivityHeader from '../../components/mypage/my-activity/MyActivityHeader'
import MyActivityList from '../../components/mypage/my-activity/MyActivityList'
import { getMyCommentPosts } from '../../components/mypage/mypageReactionData'
import '../../styles/Tailwind.css'

type Props = { onBack?: () => void }

export default function MyCommentsPage({ onBack }: Props) {
  const { email, nickname } = useUserProfile()
  const [refreshTick, setRefreshTick] = useState(0)
  const comments = useMemo(() => getMyCommentPosts(email, nickname), [email, nickname, refreshTick])
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

  useEffect(() => {
    const refresh = () => {
      setRefreshTick((prevTick) => prevTick + 1)
    }
    const refreshOnVisible = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }

    window.addEventListener(MY_ACTIVITY_CHANGED_EVENT, refresh)
    window.addEventListener('hashchange', refresh)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refreshOnVisible)

    return () => {
      window.removeEventListener(MY_ACTIVITY_CHANGED_EVENT, refresh)
      window.removeEventListener('hashchange', refresh)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refreshOnVisible)
    }
  }, [])

  return (
    <div className="app-shell">
      <div className="app-screen">
        <MyActivityHeader title="내가 쓴 댓글" onBack={handleBack} />
        <MyActivityList
          items={comments}
          unit="댓글"
          emptyTitle="아직 작성한 댓글이 없어요"
          emptyDescription="관심있는 게시글이나 레시피에 댓글을 남겨보세요."
        />
        <BottomNav />
      </div>
    </div>
  )
}

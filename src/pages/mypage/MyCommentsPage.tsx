import { useMemo } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { useUserProfile } from '../../components/common/useUserProfile'
import MyActivityHeader from '../../components/mypage/my-activity/MyActivityHeader'
import MyActivityList from '../../components/mypage/my-activity/MyActivityList'
import { getMyCommentPosts } from '../../components/mypage/mypageReactionData'
import '../../styles/Tailwind.css'

type Props = { onBack?: () => void }

export default function MyCommentsPage({ onBack }: Props) {
  const { email } = useUserProfile()
  const comments = useMemo(() => getMyCommentPosts(email), [email])
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

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

import { useMemo } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { useUserProfile } from '../../components/common/useUserProfile'
import MyActivityHeader from '../../components/mypage/my-activity/MyActivityHeader'
import MyActivityList from '../../components/mypage/my-activity/MyActivityList'
import { getMyWrittenPosts } from '../../components/mypage/mypageReactionData'
import '../../styles/Tailwind.css'

type Props = { onBack?: () => void }

export default function MyPostsPage({ onBack }: Props) {
  const { email } = useUserProfile()
  const posts = useMemo(() => getMyWrittenPosts(email), [email])
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

  return (
    <div className="app-shell">
      <div className="app-screen">
        <MyActivityHeader title="내가 쓴 게시글" onBack={handleBack} />
        <MyActivityList
          items={posts}
          unit="게시글"
          emptyTitle="아직 작성한 게시글이 없어요"
          emptyDescription="커뮤니티에서 첫 게시글을 작성해보세요."
        />
        <BottomNav />
      </div>
    </div>
  )
}

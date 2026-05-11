<<<<<<< HEAD
import type { ComponentProps } from 'react'
import LikePageView from '../../components/mypage/like-page/LikePageView'

type Props = ComponentProps<typeof LikePageView>

export default function LikePage(props: Props) {
  return <LikePageView {...props} />
=======
import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import LikePageContent from '../../components/mypage/like-page/LikePageContent'
import LikePageHeader from '../../components/mypage/like-page/LikePageHeader'
import LikePageTabs from '../../components/mypage/like-page/LikePageTabs'
import type { LikePageTab } from '../../components/mypage/like-page/LikePageTabs'
import {
  LIKED_POSTS,
  SAVED_RECIPES,
} from '../../components/mypage/like-page/likePageData'
import '../../styles/Tailwind.css'
import './LikePage.css'

type Props = { onBack?: () => void; initialTab?: LikePageTab }

function LikePage({ onBack, initialTab = 'likes' }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })
  const [activeTab, setActiveTab] = useState<LikePageTab>(initialTab)

  return (
    <div className="app-shell">
      <div className="app-screen">
        {/* LikePageHeader: 뒤로가기 헤더 영역 */}
        <LikePageHeader onBack={handleBack} />

        {/* LikePageTabs: 좋아요 / 저장한 레시피 탭 영역 */}
        <LikePageTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* LikePageContent: 선택된 탭에 맞는 카드 리스트 영역 */}
        <LikePageContent
          activeTab={activeTab}
          likedPosts={LIKED_POSTS}
          savedRecipes={SAVED_RECIPES}
        />

        {/* BottomNav: 하단 탭바 영역 */}
        <BottomNav />
      </div>
    </div>
  )
>>>>>>> 75aefe0cca3d6adbf3468ec56f7367e08164d744
}

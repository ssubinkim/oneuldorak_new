import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import LikePageContent from '../../components/mypage/like-page/LikePageContent'
import LikePageHeader from '../../components/mypage/like-page/LikePageHeader'
import LikePageTabs from '../../components/mypage/like-page/LikePageTabs'
import type { LikePageTab } from '../../components/mypage/like-page/LikePageTabs'
import { LIKED_POSTS, SAVED_RECIPES } from '../../components/mypage/like-page/likePageData'
import '../../styles/Tailwind.css'
import '../../components/mypage/like-page/LikePage.css'

type Props = { onBack?: () => void; initialTab?: LikePageTab }

export default function LikePage({ onBack, initialTab = 'likes' }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })
  const [activeTab, setActiveTab] = useState<LikePageTab>(initialTab)

  return (
    <div className="app-shell">
      <div className="app-screen">
        <LikePageHeader onBack={handleBack} />
        <LikePageTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <LikePageContent
          activeTab={activeTab}
          likedPosts={LIKED_POSTS}
          savedRecipes={SAVED_RECIPES}
        />
        <BottomNav />
      </div>
    </div>
  )
}

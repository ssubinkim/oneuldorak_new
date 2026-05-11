import { useState } from 'react'
import BottomNav from '../../common/layout/BottomNav'
import '../../../styles/Tailwind.css'
import LikePageContent from './LikePageContent'
import LikePageHeader from './LikePageHeader'
import LikePageTabs from './LikePageTabs'
import type { LikePageTab } from './LikePageTabs'
import { LIKED_POSTS, SAVED_RECIPES } from './likePageData'
import './LikePage.css'

type Props = { onBack?: () => void; initialTab?: LikePageTab }

function LikePageView({ onBack, initialTab = 'likes' }: Props) {
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

export default LikePageView

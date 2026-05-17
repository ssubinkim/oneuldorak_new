import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import LikePageContent from '../../components/mypage/like-page/LikePageContent'
import LikePageHeader from '../../components/mypage/like-page/LikePageHeader'
import LikePageTabs from '../../components/mypage/like-page/LikePageTabs'
import type { LikePageTab } from '../../components/mypage/like-page/LikePageTabs'
import { LIKE_RECIPES, LIKED_POSTS } from '../../components/mypage/like-page/likePageData'
import { getLikedBoardPosts } from '../../components/mypage/mypageReactionData'
import { useUserProfile } from '../../components/common/useUserProfile'
import '../../styles/Tailwind.css'
import '../../components/mypage/like-page/LikePage.css'

type Props = { onBack?: () => void; initialTab?: LikePageTab }

export default function LikePage({ onBack, initialTab = 'recipe' }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })
  const userProfile = useUserProfile()
  const [activeTab, setActiveTab] = useState<LikePageTab>(initialTab)

  const dynamicBoardPosts = getLikedBoardPosts(userProfile.email)
  const likedPosts = [...dynamicBoardPosts, ...LIKED_POSTS]

  return (
    <div className="app-shell">
      <div className="app-screen">
        <LikePageHeader onBack={handleBack} />
        <LikePageTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <LikePageContent
          activeTab={activeTab}
          likedPosts={likedPosts}
          likedRecipes={LIKE_RECIPES}
        />
        <BottomNav />
      </div>
    </div>
  )
}

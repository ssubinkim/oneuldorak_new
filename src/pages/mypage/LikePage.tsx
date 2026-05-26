import { useEffect, useMemo, useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import LikePageContent from '../../components/mypage/like-page/LikePageContent'
import LikePageHeader from '../../components/mypage/like-page/LikePageHeader'
import LikePageTabs from '../../components/mypage/like-page/LikePageTabs'
import type { LikePageTab } from '../../components/mypage/like-page/LikePageTabs'
import { getLikedBoardPosts, getLikedRecipes } from '../../components/mypage/mypageReactionData'
import { MY_ACTIVITY_CHANGED_EVENT } from '../../components/common/myActivityEvents'
import { useUserProfile } from '../../components/common/useUserProfile'
import '../../styles/Tailwind.css'
import '../../components/mypage/like-page/LikePage.css'

type Props = { onBack?: () => void; initialTab?: LikePageTab }

function getUrlParams() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const tab = params.get('tab')
  const from = params.get('from')
  return {
    tab: tab === 'recipe' || tab === 'post' ? tab as LikePageTab : null,
    from,
  }
}

export default function LikePage({ onBack, initialTab = 'recipe' }: Props) {
  const { tab: urlTab, from } = getUrlParams()
  const handleBack = onBack ?? (() => {
    window.location.hash = from === 'recipe' ? '#/recipe' : '#/mypage'
  })
  const userProfile = useUserProfile()
  const visibleTabs: LikePageTab[] | undefined = urlTab ? [urlTab] : undefined
  const [activeTab, setActiveTab] = useState<LikePageTab>(urlTab ?? initialTab)
  const [refreshTick, setRefreshTick] = useState(0)

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

  const likedPosts = useMemo(
    () => getLikedBoardPosts(userProfile.email),
    [userProfile.email, refreshTick],
  )
  const likedRecipes = useMemo(
    () => getLikedRecipes(userProfile.email),
    [userProfile.email, refreshTick],
  )

  return (
    <div className="app-shell">
      <div className="app-screen">
        <LikePageHeader onBack={handleBack} />
        <LikePageTabs activeTab={activeTab} onTabChange={setActiveTab} visibleTabs={visibleTabs} />
        <LikePageContent
          activeTab={activeTab}
          likedPosts={likedPosts}
          likedRecipes={likedRecipes}
        />
        <BottomNav />
      </div>
    </div>
  )
}

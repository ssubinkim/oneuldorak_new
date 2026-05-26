import { useEffect, useMemo, useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { MY_ACTIVITY_CHANGED_EVENT } from '../../components/common/myActivityEvents'
import { useUserProfile } from '../../components/common/useUserProfile'
import SavedRecipeHeader from '../../components/mypage/saved-recipe-page/SavedRecipeHeader'
import SavedRecipeList from '../../components/mypage/saved-recipe-page/SavedRecipeList'
import { getSavedRecipeCards } from '../../components/mypage/mypageReactionData'
import { SAVED_RECIPES as STATIC_SAVED_RECIPES } from '../../components/mypage/saved-recipe-page/savedRecipeData'
import '../../styles/Tailwind.css'
import '../../components/mypage/saved-recipe-page/SavedRecipePage.css'

type Props = { onBack?: () => void }

export default function SavedRecipePage({ onBack }: Props) {
  const { email } = useUserProfile()
  const fromHome = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('from') === 'home'
  const handleBack = onBack ?? (() => { window.location.hash = fromHome ? '#/home' : '#/mypage' })
  const [refreshTick, setRefreshTick] = useState(0)
  const savedRecipeCards = useMemo(() => getSavedRecipeCards(email), [email, refreshTick])
  const savedRecipes = [...savedRecipeCards, ...STATIC_SAVED_RECIPES]

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
        <SavedRecipeHeader onBack={handleBack} />
        <SavedRecipeList recipes={savedRecipes} />
        <BottomNav />
      </div>
    </div>
  )
}

import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import SavedRecipeHeader from '../../components/mypage/saved-recipe-page/SavedRecipeHeader'
import SavedRecipeList from '../../components/mypage/saved-recipe-page/SavedRecipeList'
import { getSavedRecipeCards } from '../../components/mypage/mypageReactionData'
import { SAVED_RECIPES as STATIC_SAVED_RECIPES } from '../../components/mypage/saved-recipe-page/savedRecipeData'
import '../../styles/Tailwind.css'
import '../../components/mypage/saved-recipe-page/SavedRecipePage.css'

type Props = { onBack?: () => void }

export default function SavedRecipePage({ onBack }: Props) {
  const fromHome = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('from') === 'home'
  const handleBack = onBack ?? (() => { window.location.hash = fromHome ? '#/home' : '#/mypage' })
  const [savedRecipeCards] = useState(getSavedRecipeCards)
  const savedRecipes = [...savedRecipeCards, ...STATIC_SAVED_RECIPES]

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

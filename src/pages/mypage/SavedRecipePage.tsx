import BottomNav from '../../components/common/layout/BottomNav'
import SavedRecipeHeader from '../../components/mypage/saved-recipe-page/SavedRecipeHeader'
import SavedRecipeList from '../../components/mypage/saved-recipe-page/SavedRecipeList'
import { SAVED_RECIPES } from '../../components/mypage/saved-recipe-page/savedRecipeData'
import '../../styles/Tailwind.css'
import '../../components/mypage/saved-recipe-page/SavedRecipePage.css'

type Props = { onBack?: () => void }

export default function SavedRecipePage({ onBack }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

  return (
    <div className="app-shell">
      <div className="app-screen">
        <SavedRecipeHeader onBack={handleBack} />
        <SavedRecipeList recipes={SAVED_RECIPES} />
        <BottomNav />
      </div>
    </div>
  )
}

import BottomNav from '../../common/layout/BottomNav'
import '../../../styles/Tailwind.css'
import SavedRecipeHeader from './SavedRecipeHeader'
import SavedRecipeList from './SavedRecipeList'
import { SAVED_RECIPES } from './savedRecipeData'
import './SavedRecipePage.css'

type Props = { onBack?: () => void }

function SavedRecipePageView({ onBack }: Props) {
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

export default SavedRecipePageView

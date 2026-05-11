<<<<<<< HEAD
import type { ComponentProps } from 'react'
import SavedRecipePageView from '../../components/mypage/saved-recipe-page/SavedRecipePageView'

type Props = ComponentProps<typeof SavedRecipePageView>

export default function SavedRecipePage(props: Props) {
  return <SavedRecipePageView {...props} />
=======
import BottomNav from '../../components/common/layout/BottomNav'
import SavedRecipeHeader from '../../components/mypage/saved-recipe-page/SavedRecipeHeader'
import SavedRecipeList from '../../components/mypage/saved-recipe-page/SavedRecipeList'
import { SAVED_RECIPES } from '../../components/mypage/saved-recipe-page/savedRecipeData'
import '../../styles/Tailwind.css'
import './SavedRecipePage.css'

type Props = { onBack?: () => void }

function SavedRecipePage({ onBack }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

  return (
    <div className="app-shell">
      <div className="app-screen">
        {/* SavedRecipeHeader: 뒤로가기 + 저장한 레시피 제목 헤더 영역 */}
        <SavedRecipeHeader onBack={handleBack} />

        {/* SavedRecipeList: 저장한 레시피 카드 리스트 영역 */}
        <SavedRecipeList recipes={SAVED_RECIPES} />

        {/* BottomNav: 하단 탭바 영역 */}
        <BottomNav />
      </div>
    </div>
  )
>>>>>>> 75aefe0cca3d6adbf3468ec56f7367e08164d744
}

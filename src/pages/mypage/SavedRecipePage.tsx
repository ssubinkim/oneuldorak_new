import BottomNav from '../../components/common/layout/BottomNav'
import SavedRecipeCard from '../../components/mypage/SavedRecipeCard'
import type { SavedRecipe } from '../../components/mypage/SavedRecipeCard'
import '../../styles/Tailwind.css'
import './SavedRecipePage.css'

const SAVED_RECIPES: SavedRecipe[] = [
  { id: 1, showIcon: false, title: '냉동실 파먹기 레시피', savedAt: '5일 전 저장' },
  { id: 2, showIcon: true,  title: '3000원으로 만드는 도시락', savedAt: '2일 전 저장' },
  { id: 3, showIcon: false, title: '냉동실 파먹기 레시피', savedAt: '5일 전 저장' },
  { id: 4, showIcon: false, title: '냉동실 파먹기 레시피', savedAt: '5일 전 저장' },
]

type Props = { onBack?: () => void }

function SavedRecipePage({ onBack }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

  return (
    <div className="app-shell">
      <div className="app-screen">

        {/* 헤더 */}
        <header className="saved-header">
          <button
            className="saved-header-back"
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="saved-header-title">저장한 레시피</span>
        </header>

        {/* 콘텐츠 */}
        <div className="page-scroll">
          <div className="saved-recipe-page">
            <div className="saved-recipe-list">
              {SAVED_RECIPES.map((recipe) => (
                <SavedRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default SavedRecipePage

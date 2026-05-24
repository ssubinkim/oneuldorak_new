import { useState } from 'react'
import Header from '../../components/common/layout/Header'
import BottomNav from '../../components/common/layout/BottomNav'
import RecipeHeroBanner from '../../components/recipe/RecipeHeroBanner'
import RecipeQuickActions from '../../components/recipe/RecipeQuickActions'
import RecipeWeeklySection from '../../components/recipe/RecipeWeeklySection'
import RecipePopularList from '../../components/recipe/RecipePopularList'
import RecipeTipBanner from '../../components/recipe/RecipeTipBanner'
import FreshRecipeVideoSection from '../../components/recipe/FreshRecipeVideoSection'
import RecipeDetailPage from '../recipedetail/RecipeDetailPage'
import '../../styles/Tailwind.css'
import './Recipe.css'

function Recipe() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(() => {
    const query = window.location.hash.split('?')[1] ?? ''
    return new URLSearchParams(query).get('id')
  })

  const fromHome = (() => {
    const query = window.location.hash.split('?')[1] ?? ''
    return new URLSearchParams(query).get('from') === 'home'
  })()

  const handleOpenDetail = (recipeId: string) => {
    setSelectedRecipeId(recipeId)
  }

  const handleBack = () => {
    if (fromHome) {
      window.location.hash = '#/home'
    } else {
      setSelectedRecipeId(null)
      window.location.hash = '#/recipe'
    }
  }

  if (selectedRecipeId) {
    return (
      <div className="app-shell">
        <div className="app-screen recipe-screen">
          <Header />
          <RecipeDetailPage recipeId={selectedRecipeId} onBack={handleBack} />
          <BottomNav />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="app-screen recipe-screen">
        <Header />

        <div className="recipe-banner-header">
          <div className="recipe-banner-header__left">
            <button type="button" aria-label="뒤로가기" className="recipe-banner-header__back" onClick={() => { window.history.back() }}>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
                <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1>레시피</h1>
          </div>
          <div className="recipe-banner-header__actions">
            <button type="button" aria-label="저장한 레시피" onClick={() => { window.location.hash = '#/meal-grocery?tab=storage&from=recipe' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button type="button" aria-label="레시피 작성" onClick={() => { window.location.hash = '#/recipe-write' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        <div className="recipe-scroll">
          <main className="recipe-main">
            <RecipeHeroBanner />
            <RecipeQuickActions />
            <RecipeWeeklySection onOpenDetail={handleOpenDetail} />
            <RecipePopularList onOpenDetail={handleOpenDetail} />
            <RecipeTipBanner />
            <FreshRecipeVideoSection onOpenDetail={handleOpenDetail} />
          </main>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default Recipe

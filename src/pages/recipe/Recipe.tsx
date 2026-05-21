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
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)

  const handleOpenDetail = (recipeId: string) => {
    setSelectedRecipeId(recipeId)
  }

  const handleBack = () => {
    setSelectedRecipeId(null)
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
      <div className="app-screen recipe-screen font-nanum-square-neo">
        <Header />

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

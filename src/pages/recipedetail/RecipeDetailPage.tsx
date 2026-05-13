import { useState } from 'react'
import RecipeDetailComments from '../../components/recipedetailpage/RecipeDetailComments'
import RecipeDetailHero from '../../components/recipedetailpage/RecipeDetailHero'
import RecipeDetailIngredients from '../../components/recipedetailpage/RecipeDetailIngredients'
import RecipeDetailIntro from '../../components/recipedetailpage/RecipeDetailIntro'
import RecipeDetailMethod from '../../components/recipedetailpage/RecipeDetailMethod'
import ShoppingChecklistBottomSheet from '../../components/meal/common/ShoppingChecklistBottomSheet'
import RecipeDetailSimilar from '../../components/recipedetailpage/RecipeDetailSimilar'
import RecipeDetailTools from '../../components/recipedetailpage/RecipeDetailTools'
import RecipeDetailTopBar from '../../components/recipedetailpage/RecipeDetailTopBar'
import {
  cookingSteps,
  cookingTools,
  getRecipeDetail,
  ingredients,
  recipeComments,
  recipeHeroImage,
  similarRecipes,
  stepPlaceholderIcon,
} from '../../components/recipedetailpage/recipeDetailData'
import './RecipeDetailPage.css'

type RecipeDetailPageProps = {
  recipeId: string | null
  onBack: () => void
}

function RecipeDetailPage({ recipeId, onBack }: RecipeDetailPageProps) {
  const [isShoppingSheetOpen, setIsShoppingSheetOpen] = useState(false)
  const recipe = getRecipeDetail(recipeId)

  return (
    <main className="page-scroll recipe-detail-page">
      <RecipeDetailTopBar onBack={onBack} />

      <article className="recipe-detail-card">
        <RecipeDetailHero image={recipeHeroImage} title={recipe.title} />
        <RecipeDetailIntro recipe={recipe} />
        <RecipeDetailIngredients
          ingredients={ingredients}
          onShoppingChecklistClick={() => setIsShoppingSheetOpen(true)}
        />
        <RecipeDetailTools tools={cookingTools} />
        <RecipeDetailMethod
          heroImage={recipeHeroImage}
          stepIcon={stepPlaceholderIcon}
          steps={cookingSteps}
        />
        <RecipeDetailComments comments={recipeComments} />
        <RecipeDetailSimilar recipes={similarRecipes} />
      </article>

      <ShoppingChecklistBottomSheet
        isOpen={isShoppingSheetOpen}
        onClose={() => setIsShoppingSheetOpen(false)}
      />
    </main>
  )
}

export default RecipeDetailPage

import { useEffect, useState } from 'react'
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
  type RecipeComment,
  type RecipeDetail,
  type RecipeStats,
  recipeComments,
  recipeHeroImage,
  similarRecipes,
  stepPlaceholderIcon,
} from '../../components/recipedetailpage/recipeDetailData'
import {
  getPersistedRecipeDetailState,
  savePersistedRecipeDetailState,
} from '../../components/recipedetailpage/recipeDetailPersistence'
import './RecipeDetailPage.css'

type RecipeDetailPageProps = {
  recipeId: string | null
  onBack: () => void
  overrideRecipe?: RecipeDetail | null
}

function isPersistableRecipeId(recipeId: string): recipeId is 'recipe-1' | 'recipe-2' | 'recipe-3' {
  return recipeId === 'recipe-1' || recipeId === 'recipe-2' || recipeId === 'recipe-3'
}

function RecipeDetailPage({ recipeId, onBack, overrideRecipe = null }: RecipeDetailPageProps) {
  const [isShoppingSheetOpen, setIsShoppingSheetOpen] = useState(false)
  const [recipe, setRecipe] = useState(() => overrideRecipe ?? getRecipeDetail(recipeId))
  const [comments, setComments] = useState<RecipeComment[]>(recipeComments)
  const [checkedIngredientIds, setCheckedIngredientIds] = useState<string[]>([])
  const [hasHydratedFromStorage, setHasHydratedFromStorage] = useState(false)

  useEffect(() => {
    if (overrideRecipe) {
      setRecipe(overrideRecipe)
      setComments(recipeComments)
      setCheckedIngredientIds([])
      setHasHydratedFromStorage(true)
      return
    }

    const nextRecipe = getRecipeDetail(recipeId)
    const persistedState = isPersistableRecipeId(nextRecipe.id)
      ? getPersistedRecipeDetailState(nextRecipe.id, {
          stats: nextRecipe.stats,
          comments: recipeComments,
          checkedIngredientIds: [],
        })
      : {
          stats: nextRecipe.stats,
          comments: recipeComments,
          checkedIngredientIds: [],
        }

    setRecipe({
      ...nextRecipe,
      stats: persistedState.stats,
    })
    setComments(persistedState.comments)
    setCheckedIngredientIds(persistedState.checkedIngredientIds)
    setHasHydratedFromStorage(true)
  }, [overrideRecipe, recipeId])

  useEffect(() => {
    if (!hasHydratedFromStorage) {
      return
    }

    if (!isPersistableRecipeId(recipe.id)) {
      return
    }

    savePersistedRecipeDetailState(recipe.id, {
      stats: recipe.stats,
      comments,
      checkedIngredientIds,
    })
  }, [checkedIngredientIds, comments, hasHydratedFromStorage, recipe.id, recipe.stats])

  const increaseStat = (key: keyof RecipeStats) => {
    setRecipe((previous) => ({
      ...previous,
      stats: {
        ...previous.stats,
        [key]: previous.stats[key] + 1,
      },
    }))
  }

  const handleToggleIngredient = (ingredientId: string) => {
    setCheckedIngredientIds((previous) =>
      previous.includes(ingredientId)
        ? previous.filter((id) => id !== ingredientId)
        : [...previous, ingredientId],
    )
  }

  const handleAddComment = (content: string) => {
    const now = new Date()
    const publishedOn = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate(),
    ).padStart(2, '0')}`

    const nextComment: RecipeComment = {
      id: `comment-${Date.now()}`,
      authorName: '나',
      publishedOn,
      content,
    }

    setComments((previous) => [...previous, nextComment])
    increaseStat('commentCount')
  }

  return (
    <main className="page-scroll recipe-detail-page">
      <RecipeDetailTopBar onBack={onBack} />

      <article className="recipe-detail-card">
        <RecipeDetailHero image={recipeHeroImage} title={recipe.title} />
        <RecipeDetailIntro
          recipe={recipe}
          onLikeClick={() => increaseStat('likeCount')}
          onSaveClick={() => increaseStat('saveCount')}
        />
        <RecipeDetailIngredients
          ingredients={ingredients}
          checkedIngredientIds={checkedIngredientIds}
          onToggleIngredient={handleToggleIngredient}
          onShoppingChecklistClick={() => setIsShoppingSheetOpen(true)}
        />
        <RecipeDetailTools tools={cookingTools} />
        <RecipeDetailMethod
          heroImage={recipeHeroImage}
          stepIcon={stepPlaceholderIcon}
          steps={cookingSteps}
        />
        <RecipeDetailComments comments={comments} onAddComment={handleAddComment} />
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

import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from '../../components/common/useUserProfile'
import RecipeWriteForm from '../../components/community/communitywritepage/RecipeWriteForm'
import type { RecipeWriteData } from '../../components/community/communitywritepage/writeTypes'
import RecipeDetailComments from '../../components/recipedetailpage/RecipeDetailComments'
import RecipeDetailHero from '../../components/recipedetailpage/RecipeDetailHero'
import RecipeDetailIngredients from '../../components/recipedetailpage/RecipeDetailIngredients'
import RecipeDetailIntro from '../../components/recipedetailpage/RecipeDetailIntro'
import RecipeDetailMethod from '../../components/recipedetailpage/RecipeDetailMethod'
import RecipeDetailSimilar from '../../components/recipedetailpage/RecipeDetailSimilar'
import RecipeDetailTopBar from '../../components/recipedetailpage/RecipeDetailTopBar'
import { awardActivityPoint } from '../../components/common/usePoints'
import {
  cookingSteps,
  getRecipeDetail,
  getRecipeIngredientsFromText,
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
  onUpdateRecipe?: (recipeId: string, data: RecipeWriteData) => void | Promise<RecipeWriteData | void>
  onDeleteRecipe?: (recipeId: string) => void
}

const emptyRecipeEditValue: RecipeWriteData = {
  title: '',
  content: '',
  difficulty: 1,
  budget: '',
  time: '',
  ingredient: '',
  tools: [],
  media: [],
}

const emptyRecipeReactionState = {
  isLiked: false,
  isSaved: false,
}

function getRecipeEditValue(recipe: RecipeDetail | null | undefined): RecipeWriteData {
  if (!recipe) {
    return emptyRecipeEditValue
  }

  return {
    title: recipe.title,
    content: recipe.summary,
    difficulty: recipe.cook.difficultyLevel,
    budget: recipe.cook.budgetLabel,
    time: `${recipe.cook.durationMinutes}분`,
    ingredient: recipe.ingredients?.map((ingredient) => ingredient.name).join(', ') ?? '',
    tools: recipe.tools?.map((tool) => tool.label) ?? [],
    media: recipe.media ?? [],
  }
}

function isOwnRecipe(recipe: RecipeDetail, currentUserId: string, nickname: string) {
  if (recipe.meta.authorId) {
    return recipe.meta.authorId === currentUserId
  }

  return recipe.id.startsWith('user-recipe') && recipe.meta.authorName === nickname
}

function normalizePersistedRecipeState(
  baseStats: RecipeStats,
  persistedState: ReturnType<typeof getPersistedRecipeDetailState>,
) {
  const isLiked = persistedState.isLiked || persistedState.stats.likeCount > baseStats.likeCount
  const isSaved = persistedState.isSaved || persistedState.stats.saveCount > baseStats.saveCount

  return {
    ...persistedState,
    isLiked,
    isSaved,
    stats: {
      ...persistedState.stats,
      likeCount: baseStats.likeCount + (isLiked ? 1 : 0),
      saveCount: baseStats.saveCount + (isSaved ? 1 : 0),
    },
  }
}

function RecipeDetailPage({
  recipeId,
  onBack,
  overrideRecipe = null,
  onUpdateRecipe,
  onDeleteRecipe,
}: RecipeDetailPageProps) {
  const { email, nickname } = useUserProfile()
  const pageRef = useRef<HTMLElement | null>(null)
  const [recipe, setRecipe] = useState(() => overrideRecipe ?? getRecipeDetail(recipeId))
  const [comments, setComments] = useState<RecipeComment[]>(recipeComments)
  const [hasHydratedFromStorage, setHasHydratedFromStorage] = useState(false)
  const [isEditingRecipe, setIsEditingRecipe] = useState(false)
  const [recipeEditValue, setRecipeEditValue] = useState<RecipeWriteData>(() => getRecipeEditValue(recipe))
  const [recipeReactionState, setRecipeReactionState] = useState(emptyRecipeReactionState)
  const canManageRecipe = Boolean(onUpdateRecipe && onDeleteRecipe && isOwnRecipe(recipe, email, nickname))

  useEffect(() => {
    const applyHydratedState = (
      nextRecipe: RecipeDetail,
      persistedState: ReturnType<typeof normalizePersistedRecipeState>,
    ) => {
      queueMicrotask(() => {
        setRecipe(nextRecipe)
        setRecipeEditValue(getRecipeEditValue(nextRecipe))
        setRecipeReactionState({
          isLiked: persistedState.isLiked,
          isSaved: persistedState.isSaved,
        })
        setIsEditingRecipe(false)
        setComments(persistedState.comments)
        setHasHydratedFromStorage(true)
      })
    }

    if (overrideRecipe) {
      const persistedState = normalizePersistedRecipeState(
        overrideRecipe.stats,
        getPersistedRecipeDetailState(overrideRecipe.id, {
          stats: overrideRecipe.stats,
          comments: recipeComments,
          checkedIngredientIds: [],
          isLiked: false,
          isSaved: false,
        }),
      )
      const nextRecipe = {
        ...overrideRecipe,
        stats: persistedState.stats,
      }

      applyHydratedState(nextRecipe, persistedState)
      return
    }

    const nextRecipe = getRecipeDetail(recipeId)
    const persistedState = normalizePersistedRecipeState(
      nextRecipe.stats,
      getPersistedRecipeDetailState(nextRecipe.id, {
        stats: nextRecipe.stats,
        comments: recipeComments,
        checkedIngredientIds: [],
        isLiked: false,
        isSaved: false,
      }),
    )

    applyHydratedState({
      ...nextRecipe,
      stats: persistedState.stats,
    }, persistedState)
  }, [overrideRecipe, recipeId])

  useEffect(() => {
    if (!hasHydratedFromStorage) {
      return
    }

    savePersistedRecipeDetailState(recipe.id, {
      stats: recipe.stats,
      comments,
      checkedIngredientIds: [],
      isLiked: recipeReactionState.isLiked,
      isSaved: recipeReactionState.isSaved,
    })
  }, [
    comments,
    hasHydratedFromStorage,
    recipe.id,
    recipe.stats,
    recipeReactionState.isLiked,
    recipeReactionState.isSaved,
  ])

  const increaseStat = (key: keyof RecipeStats) => {
    setRecipe((previous) => ({
      ...previous,
      stats: {
        ...previous.stats,
        [key]: previous.stats[key] + 1,
      },
    }))
  }

  const toggleRecipeReaction = (
    statKey: 'likeCount' | 'saveCount',
    reactionKey: keyof typeof emptyRecipeReactionState,
  ) => {
    const nextIsActive = !recipeReactionState[reactionKey]

    setRecipeReactionState((previous) => ({
      ...previous,
      [reactionKey]: nextIsActive,
    }))
    setRecipe((previous) => ({
      ...previous,
      stats: {
        ...previous.stats,
        [statKey]: Math.max(0, previous.stats[statKey] + (nextIsActive ? 1 : -1)),
      },
    }))
  }

  const decreaseStat = (key: keyof RecipeStats) => {
    setRecipe((previous) => ({
      ...previous,
      stats: {
        ...previous.stats,
        [key]: Math.max(0, previous.stats[key] - 1),
      },
    }))
  }

  const handleToggleLike = () => {
    toggleRecipeReaction('likeCount', 'isLiked')
  }

  const handleToggleSave = () => {
    toggleRecipeReaction('saveCount', 'isSaved')
  }

  const handleSaveRecipeEdit = async () => {
    if (!onUpdateRecipe) {
      return
    }

    const nextTitle = recipeEditValue.title.trim()
    const nextContent = recipeEditValue.content.trim()

    if (!nextTitle || !nextContent) {
      return
    }

    const nextRecipeValue = {
      ...recipeEditValue,
      title: nextTitle,
      content: nextContent,
    }
    const savedRecipeValue = await onUpdateRecipe(recipe.id, nextRecipeValue) ?? nextRecipeValue
    const parsedDurationMinutes = Number(savedRecipeValue.time.match(/\d+/)?.[0])

    setRecipe((previous) => ({
      ...previous,
      title: savedRecipeValue.title,
      summary: savedRecipeValue.content,
      cook: {
        durationMinutes: Number.isFinite(parsedDurationMinutes) && parsedDurationMinutes > 0
          ? parsedDurationMinutes
          : previous.cook.durationMinutes,
        budgetLabel: savedRecipeValue.budget || previous.cook.budgetLabel,
        difficultyLevel: savedRecipeValue.difficulty,
      },
      ingredients: getRecipeIngredientsFromText(savedRecipeValue.ingredient),
      tools: savedRecipeValue.tools.map((tool, index) => ({
        id: `user-tool-${index}-${tool}`,
        label: tool,
      })),
      media: savedRecipeValue.media,
    }))
    setIsEditingRecipe(false)
  }

  const handleDeleteRecipe = () => {
    if (!onDeleteRecipe) {
      return
    }

    const shouldDelete = window.confirm('레시피를 삭제할까요?')

    if (shouldDelete) {
      onDeleteRecipe(recipe.id)
    }
  }

  const handleStartRecipeEdit = () => {
    setRecipeEditValue(getRecipeEditValue(recipe))
    setIsEditingRecipe(true)
    requestAnimationFrame(() => {
      pageRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    })
  }

  const visibleIngredients = recipe.ingredients && recipe.ingredients.length > 0
    ? recipe.ingredients
    : ingredients
  const recipeImageMedia = recipe.media?.find((attachment) => attachment.kind === 'image' && attachment.url)
  const recipeVideoMedia = recipe.media?.find((attachment) => attachment.kind === 'video' && attachment.url)
  const visibleHeroImage = recipeImageMedia?.url ?? recipeHeroImage

  const handleAddComment = (content: string) => {
    const now = new Date()
    const publishedOn = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate(),
    ).padStart(2, '0')}`

    const nextComment: RecipeComment = {
      id: `comment-${Date.now()}`,
      authorName: nickname,
      authorId: email,
      publishedOn,
      content,
    }

    setComments((previous) => [nextComment, ...previous])
    increaseStat('commentCount')
    awardActivityPoint('comment-write', 1)
  }

  const handleShareClick = async () => {
    const shareText = `${recipe.title} 레시피를 확인해보세요.`
    const shareUrl = typeof window === 'undefined' ? '' : window.location.href

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: shareUrl,
        })
      } else if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(shareUrl)
        window.alert('링크가 복사되었어요.')
      } else {
        window.alert('공유 기능을 사용할 수 없어요.')
        return
      }

      awardActivityPoint('kakao-share', 10)
    } catch {
      // 공유 시트를 닫은 경우 등은 적립하지 않습니다.
    }
  }

  const handleUpdateComment = (commentId: string, content: string) => {
    const nextContent = content.trim()

    if (!nextContent) {
      return
    }

    setComments((previous) =>
      previous.map((comment) =>
        comment.id === commentId ? { ...comment, content: nextContent } : comment,
      ),
    )
  }

  const handleDeleteComment = (commentId: string) => {
    const targetComment = comments.find((comment) => comment.id === commentId)

    if (!targetComment) {
      return
    }

    const shouldDelete = window.confirm('댓글을 삭제할까요?')

    if (!shouldDelete) {
      return
    }

    setComments((previous) => previous.filter((comment) => comment.id !== commentId))
    decreaseStat('commentCount')
  }

  return (
    <main className="page-scroll recipe-detail-page" ref={pageRef}>
      <RecipeDetailTopBar
        onBack={onBack}
        isLiked={recipeReactionState.isLiked}
        isSaved={recipeReactionState.isSaved}
        onLikeClick={handleToggleLike}
        onSaveClick={handleToggleSave}
        onShareClick={() => {
          void handleShareClick()
        }}
      />

      <article className="recipe-detail-card">
        {isEditingRecipe ? (
          <section className="recipe-detail-edit-card" aria-label="레시피 수정">
            <h1>레시피 수정</h1>
            <div className="recipe-detail-edit-form">
              <RecipeWriteForm value={recipeEditValue} onChange={setRecipeEditValue} />
            </div>
            <div className="recipe-detail-edit-actions">
              <button type="button" onClick={() => setIsEditingRecipe(false)}>취소</button>
              <button type="button" onClick={handleSaveRecipeEdit}>저장</button>
            </div>
          </section>
        ) : (
          <>
            <RecipeDetailHero image={visibleHeroImage} title={recipe.title} />
            <RecipeDetailIntro
              recipe={recipe}
              isLiked={recipeReactionState.isLiked}
              isSaved={recipeReactionState.isSaved}
              onLikeClick={handleToggleLike}
              onSaveClick={handleToggleSave}
            />
            {canManageRecipe && (
              <div className="recipe-detail-owner-actions">
                <button type="button" onClick={handleStartRecipeEdit}>수정</button>
                <button type="button" onClick={handleDeleteRecipe}>삭제</button>
              </div>
            )}
            <RecipeDetailIngredients ingredients={visibleIngredients} />
            <RecipeDetailMethod
              heroImage={visibleHeroImage}
              videoUrl={recipeVideoMedia?.url}
              videoLabel={recipeVideoMedia?.name}
              stepIcon={stepPlaceholderIcon}
              steps={cookingSteps}
            />
            <RecipeDetailComments
              comments={comments}
              currentUserId={email}
              currentUserName={nickname}
              onAddComment={handleAddComment}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
            />
            <RecipeDetailSimilar recipes={similarRecipes} />
          </>
        )}
      </article>
    </main>
  )
}

export default RecipeDetailPage

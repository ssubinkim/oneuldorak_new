import type { RecipeComment, RecipeStats } from './recipeDetailData'

const RECIPE_DETAIL_STORAGE_KEY = 'oneuldorak:recipe-detail-saved-data:v1'

export type PersistedRecipeDetailState = {
  stats: RecipeStats
  comments: RecipeComment[]
  checkedIngredientIds: string[]
  isLiked: boolean
  isSaved: boolean
  updatedAt: string
}

type PersistedRecipeDetailMap = Record<string, PersistedRecipeDetailState>

function isBrowser() {
  return typeof window !== 'undefined'
}

function isValidStats(value: unknown): value is RecipeStats {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<RecipeStats>
  return (
    Number.isFinite(candidate.likeCount) &&
    Number.isFinite(candidate.commentCount) &&
    Number.isFinite(candidate.saveCount)
  )
}

function isValidComment(value: unknown): value is RecipeComment {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<RecipeComment>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.authorName === 'string' &&
    (typeof candidate.authorId === 'undefined' || typeof candidate.authorId === 'string') &&
    typeof candidate.publishedOn === 'string' &&
    typeof candidate.content === 'string'
  )
}

function readPersistedRecipeDetailMap(): PersistedRecipeDetailMap {
  if (!isBrowser()) {
    return {}
  }

  const rawValue = window.localStorage.getItem(RECIPE_DETAIL_STORAGE_KEY)
  if (!rawValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, unknown>
    const nextMap: PersistedRecipeDetailMap = {}

    for (const [rawRecipeId, rawState] of Object.entries(parsedValue)) {
      if (!rawState || typeof rawState !== 'object') {
        continue
      }

      const state = rawState as {
        stats?: unknown
        comments?: unknown
        checkedIngredientIds?: unknown
        isLiked?: unknown
        isSaved?: unknown
        updatedAt?: unknown
      }

      if (!isValidStats(state.stats) || !Array.isArray(state.comments) || !Array.isArray(state.checkedIngredientIds)) {
        continue
      }

      const comments = state.comments.filter(isValidComment)
      const checkedIngredientIds = state.checkedIngredientIds.filter(
        (ingredientId): ingredientId is string => typeof ingredientId === 'string',
      )

      if (rawRecipeId) {
        nextMap[rawRecipeId] = {
          stats: state.stats,
          comments,
          checkedIngredientIds,
          isLiked: typeof state.isLiked === 'boolean' ? state.isLiked : false,
          isSaved: typeof state.isSaved === 'boolean' ? state.isSaved : false,
          updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : '',
        }
      }
    }

    return nextMap
  } catch {
    return {}
  }
}

function writePersistedRecipeDetailMap(dataMap: PersistedRecipeDetailMap) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(RECIPE_DETAIL_STORAGE_KEY, JSON.stringify(dataMap))
}

export function getPersistedRecipeDetailState(
  recipeId: string,
  fallbackState: Pick<PersistedRecipeDetailState, 'stats' | 'comments' | 'checkedIngredientIds'> &
    Partial<Pick<PersistedRecipeDetailState, 'isLiked' | 'isSaved'>>,
) {
  const dataMap = readPersistedRecipeDetailMap()
  const persistedState = dataMap[recipeId]

  if (!persistedState) {
    return {
      ...fallbackState,
      isLiked: fallbackState.isLiked ?? false,
      isSaved: fallbackState.isSaved ?? false,
      updatedAt: '',
    }
  }

  return persistedState
}

export function savePersistedRecipeDetailState(
  recipeId: string,
  state: Pick<PersistedRecipeDetailState, 'stats' | 'comments' | 'checkedIngredientIds' | 'isLiked' | 'isSaved'>,
) {
  const dataMap = readPersistedRecipeDetailMap()

  dataMap[recipeId] = {
    ...state,
    updatedAt: new Date().toISOString(),
  }

  writePersistedRecipeDetailMap(dataMap)
}

export function getAllPersistedRecipeDetailState() {
  return readPersistedRecipeDetailMap()
}

import type { RecipeComment, RecipeStats } from './recipeDetailData'
import { notifyMyActivityChanged } from '../common/myActivityEvents'

const RECIPE_DETAIL_STORAGE_KEY = 'oneuldorak:recipe-detail-saved-data:v1'
const LEGACY_DEFAULT_USER_ID = 'dorak_friends@oneuldorak.com'

type PersistedRecipeUserReactionState = {
  isLiked: boolean
  isSaved: boolean
  updatedAt: string
}

export type PersistedRecipeDetailState = {
  stats: RecipeStats
  comments: RecipeComment[]
  checkedIngredientIds: string[]
  isLiked: boolean
  isSaved: boolean
  updatedAt: string
  reactionsByUser?: Record<string, PersistedRecipeUserReactionState>
}

type PersistedRecipeDetailMap = Record<string, PersistedRecipeDetailState>

function isBrowser() {
  return typeof window !== 'undefined'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function normalizeUserId(userId?: string) {
  return typeof userId === 'string' ? userId.trim().toLowerCase() : ''
}

function isValidStats(value: unknown): value is RecipeStats {
  if (!isRecord(value)) {
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
  if (!isRecord(value)) {
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

function isValidReactionByUserMap(value: unknown): value is Record<string, PersistedRecipeUserReactionState> {
  if (!isRecord(value)) {
    return false
  }

  return Object.values(value).every((reaction) => {
    if (!isRecord(reaction)) {
      return false
    }

    return (
      typeof reaction.isLiked === 'boolean' &&
      typeof reaction.isSaved === 'boolean' &&
      typeof reaction.updatedAt === 'string'
    )
  })
}

function resolveRecipeReactionState(
  state: PersistedRecipeDetailState,
  currentUserId?: string,
): PersistedRecipeDetailState {
  const normalizedCurrentUserId = normalizeUserId(currentUserId)

  if (!normalizedCurrentUserId) {
    return state
  }

  const reactionsByUser = state.reactionsByUser

  if (reactionsByUser && Object.keys(reactionsByUser).length > 0) {
    const currentUserReaction = reactionsByUser[normalizedCurrentUserId]

    if (!currentUserReaction) {
      return {
        ...state,
        isLiked: false,
        isSaved: false,
        updatedAt: '',
      }
    }

    return {
      ...state,
      isLiked: currentUserReaction.isLiked,
      isSaved: currentUserReaction.isSaved,
      updatedAt: currentUserReaction.updatedAt,
    }
  }

  if (normalizedCurrentUserId && normalizedCurrentUserId !== LEGACY_DEFAULT_USER_ID) {
    return {
      ...state,
      isLiked: false,
      isSaved: false,
      updatedAt: '',
    }
  }

  return state
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
        reactionsByUser?: unknown
      }

      if (!isValidStats(state.stats) || !Array.isArray(state.comments) || !Array.isArray(state.checkedIngredientIds)) {
        continue
      }

      const comments = state.comments.filter(isValidComment)
      const checkedIngredientIds = state.checkedIngredientIds.filter(
        (ingredientId): ingredientId is string => typeof ingredientId === 'string',
      )
      const reactionsByUser = isValidReactionByUserMap(state.reactionsByUser)
        ? state.reactionsByUser
        : undefined

      if (rawRecipeId) {
        nextMap[rawRecipeId] = {
          stats: state.stats,
          comments,
          checkedIngredientIds,
          isLiked: typeof state.isLiked === 'boolean' ? state.isLiked : false,
          isSaved: typeof state.isSaved === 'boolean' ? state.isSaved : false,
          updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : '',
          reactionsByUser,
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
  currentUserId?: string,
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

  return resolveRecipeReactionState(persistedState, currentUserId)
}

export function savePersistedRecipeDetailState(
  recipeId: string,
  state: Pick<PersistedRecipeDetailState, 'stats' | 'comments' | 'checkedIngredientIds' | 'isLiked' | 'isSaved'>,
  currentUserId?: string,
) {
  const dataMap = readPersistedRecipeDetailMap()
  const previousState = dataMap[recipeId]
  const updatedAt = new Date().toISOString()
  const normalizedCurrentUserId = normalizeUserId(currentUserId)
  const nextReactionsByUser = {
    ...(previousState?.reactionsByUser ?? {}),
  }

  if (normalizedCurrentUserId) {
    nextReactionsByUser[normalizedCurrentUserId] = {
      isLiked: state.isLiked,
      isSaved: state.isSaved,
      updatedAt,
    }
  }

  dataMap[recipeId] = {
    ...state,
    updatedAt,
    reactionsByUser: Object.keys(nextReactionsByUser).length > 0 ? nextReactionsByUser : undefined,
  }

  writePersistedRecipeDetailMap(dataMap)
  notifyMyActivityChanged()
}

export function getAllPersistedRecipeDetailState(currentUserId?: string) {
  const dataMap = readPersistedRecipeDetailMap()
  const normalizedCurrentUserId = normalizeUserId(currentUserId)

  if (!normalizedCurrentUserId) {
    return dataMap
  }

  return Object.entries(dataMap).reduce<PersistedRecipeDetailMap>((resolvedMap, [recipeId, state]) => {
    resolvedMap[recipeId] = resolveRecipeReactionState(state, normalizedCurrentUserId)
    return resolvedMap
  }, {})
}

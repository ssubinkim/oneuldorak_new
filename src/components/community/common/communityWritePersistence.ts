import type { BoardDetailPost } from '../boarddetailpage/BoardContent'
import type { BoardPost } from '../boardpage/BoardList'
import type { RecipeItem } from '../recipepage/RecipeList'
import type { VoteCardItem } from '../votepage/VoteList'

const COMMUNITY_WRITE_STORAGE_KEY = 'oneuldorak:community-write:v1'

export type PersistedCommunityWriteState = {
  recipes: RecipeItem[]
  boardPosts: BoardPost[]
  boardDetailPosts: BoardDetailPost[]
  votes: VoteCardItem[]
}

const emptyPersistedCommunityWriteState: PersistedCommunityWriteState = {
  recipes: [],
  boardPosts: [],
  boardDetailPosts: [],
  votes: [],
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function readJsonStorage<T>(key: string, fallbackValue: T): T {
  if (!isBrowser()) {
    return fallbackValue
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallbackValue
  }
}

function isRecipeItem(value: unknown): value is RecipeItem {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.subtitle === 'string' &&
    typeof value.price === 'string' &&
    typeof value.time === 'string' &&
    typeof value.level === 'string' &&
    typeof value.author === 'string' &&
    typeof value.likes === 'number' &&
    typeof value.comments === 'number' &&
    typeof value.saves === 'number'
  )
}

function isBoardPost(value: unknown): value is BoardPost {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.category === 'string' &&
    typeof value.title === 'string' &&
    typeof value.body === 'string' &&
    typeof value.user === 'string' &&
    typeof value.timeAgo === 'string' &&
    typeof value.likes === 'number' &&
    typeof value.comments === 'number'
  )
}

function isBoardDetailPost(value: unknown): value is BoardDetailPost {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.category === 'string' &&
    typeof value.reward === 'string' &&
    typeof value.title === 'string' &&
    typeof value.author === 'string' &&
    typeof value.timeAgo === 'string' &&
    typeof value.likes === 'number' &&
    typeof value.comments === 'number' &&
    Array.isArray(value.paragraphs) &&
    value.paragraphs.every((paragraph) => typeof paragraph === 'string') &&
    Array.isArray(value.methods) &&
    value.methods.every((method) => typeof method === 'string')
  )
}

function isVoteCardItem(value: unknown): value is VoteCardItem {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.question === 'string' &&
    typeof value.participants === 'number' &&
    (typeof value.deadline === 'string' || typeof value.deadline === 'function') &&
    Array.isArray(value.options)
  )
}

export function readPersistedCommunityWriteState(): PersistedCommunityWriteState {
  const parsedValue = readJsonStorage<unknown>(COMMUNITY_WRITE_STORAGE_KEY, null)

  if (!isRecord(parsedValue)) {
    return emptyPersistedCommunityWriteState
  }

  const recipes = Array.isArray(parsedValue.recipes)
    ? parsedValue.recipes.filter(isRecipeItem)
    : []
  const boardPosts = Array.isArray(parsedValue.boardPosts)
    ? parsedValue.boardPosts.filter(isBoardPost)
    : []
  const boardDetailPosts = Array.isArray(parsedValue.boardDetailPosts)
    ? parsedValue.boardDetailPosts.filter(isBoardDetailPost)
    : []
  const votes = Array.isArray(parsedValue.votes)
    ? parsedValue.votes.filter(isVoteCardItem)
    : []

  const boardDetailsById = new Map(boardDetailPosts.map((post) => [post.id, post]))
  const normalizedBoardDetailPosts = boardPosts.map((post) => {
    const matchedDetailPost = boardDetailsById.get(post.id)

    if (matchedDetailPost) {
      if (matchedDetailPost.id.startsWith('user-board')) {
        return {
          ...matchedDetailPost,
          methods: [],
        }
      }

      return matchedDetailPost
    }

    return {
      id: post.id,
      category: post.category,
      reward: '인기글 1P',
      title: post.title,
      author: post.user,
      timeAgo: post.timeAgo,
      likes: post.likes,
      comments: post.comments,
      paragraphs: [post.body],
      methods: [],
    }
  })

  return {
    recipes,
    boardPosts,
    boardDetailPosts: normalizedBoardDetailPosts,
    votes,
  }
}

export function savePersistedCommunityWriteState(nextState: PersistedCommunityWriteState) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(COMMUNITY_WRITE_STORAGE_KEY, JSON.stringify(nextState))
}

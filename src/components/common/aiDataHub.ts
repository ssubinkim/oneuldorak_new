import type { ShoppingItem } from '../meal/grocery/groceryTypes'
import {
  mockBoardComments,
  mockBoardDetailPosts,
  mockBoardPopularPosts,
  mockBoardPosts,
} from '../community/common/boardMockData'
import { readPersistedCommunityWriteState } from '../community/common/communityWritePersistence'
import { getAllPersistedRecipeDetailState } from '../recipedetailpage/recipeDetailPersistence'
import { getPointBalanceSnapshot, getPointStateSnapshot } from './usePoints'
import { getUserProfile } from './useUserProfile'

const ONBOARDING_ANSWERS_STORAGE_KEY = 'oneuldorak:onboarding-answers'
const GROCERY_SHOPPING_STORAGE_KEY = 'oneuldorak:grocery-shopping-items:v1'
const CHATBOT_HISTORY_STORAGE_KEY = 'oneuldorak:chatbot-history:v1'
const CHATBOT_FRIDGE_INGREDIENTS_STORAGE_KEY = 'oneuldorak:chatbot-fridge-ingredients:v1'

type ChatbotHistorySource = 'input' | 'quick'

export type ChatbotHistoryMessage = {
  id: string
  source: ChatbotHistorySource
  text: string
  createdAt: string
}

export type AiUserDataSnapshot = {
  generatedAt: string
  route: string
  profile: ReturnType<typeof getUserProfile>
  onboardingAnswers: unknown
  recipeDetail: ReturnType<typeof getAllPersistedRecipeDetailState>
  groceryShoppingItems: ShoppingItem[]
  chatbotFridgeIngredients: string[]
  chatbotHistory: ChatbotHistoryMessage[]
  communityWrite: ReturnType<typeof readPersistedCommunityWriteState>
  communityBoardMock: {
    posts: typeof mockBoardPosts
    detailPosts: typeof mockBoardDetailPosts
    popularPosts: typeof mockBoardPopularPosts
    comments: typeof mockBoardComments
  }
  points: {
    raw: ReturnType<typeof getPointStateSnapshot>
    balance: ReturnType<typeof getPointBalanceSnapshot>
  }
}

declare global {
  interface Window {
    __ONEULDORAK_AI_DATA__?: () => AiUserDataSnapshot
  }
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function readJsonStorage<T>(storage: Storage, key: string, fallbackValue: T): T {
  const rawValue = storage.getItem(key)

  if (!rawValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallbackValue
  }
}

function writeJsonStorage(storage: Storage, key: string, value: unknown) {
  storage.setItem(key, JSON.stringify(value))
}

export function saveOnboardingAnswers(answers: unknown) {
  if (!isBrowser()) {
    return
  }

  writeJsonStorage(window.sessionStorage, ONBOARDING_ANSWERS_STORAGE_KEY, answers)
}

export function readOnboardingAnswers() {
  if (!isBrowser()) {
    return null
  }

  return readJsonStorage<unknown>(window.sessionStorage, ONBOARDING_ANSWERS_STORAGE_KEY, null)
}

function isValidShoppingItem(value: unknown): value is ShoppingItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<ShoppingItem>
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.image === 'string' &&
    typeof candidate.checked === 'boolean'
  )
}

export function readGroceryShoppingItems(fallbackItems: ShoppingItem[]) {
  if (!isBrowser()) {
    return fallbackItems
  }

  const storedItems = readJsonStorage<unknown>(window.localStorage, GROCERY_SHOPPING_STORAGE_KEY, null)

  if (!Array.isArray(storedItems)) {
    return fallbackItems
  }

  const validStoredItems = storedItems.filter(isValidShoppingItem)

  if (validStoredItems.length !== storedItems.length) {
    return fallbackItems
  }

  return validStoredItems
}

export function saveGroceryShoppingItems(items: ShoppingItem[]) {
  if (!isBrowser()) {
    return
  }

  writeJsonStorage(window.localStorage, GROCERY_SHOPPING_STORAGE_KEY, items)
}

export function readChatbotHistory() {
  if (!isBrowser()) {
    return [] as ChatbotHistoryMessage[]
  }

  const storedHistory = readJsonStorage<unknown>(window.localStorage, CHATBOT_HISTORY_STORAGE_KEY, [])

  if (!Array.isArray(storedHistory)) {
    return [] as ChatbotHistoryMessage[]
  }

  return storedHistory.filter((item): item is ChatbotHistoryMessage => {
    if (!item || typeof item !== 'object') {
      return false
    }

    const candidate = item as Partial<ChatbotHistoryMessage>
    return (
      typeof candidate.id === 'string' &&
      (candidate.source === 'input' || candidate.source === 'quick') &&
      typeof candidate.text === 'string' &&
      typeof candidate.createdAt === 'string'
    )
  })
}

function normalizeIngredientLabel(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function readChatbotFridgeIngredients() {
  if (!isBrowser()) {
    return [] as string[]
  }

  const storedIngredients = readJsonStorage<unknown>(window.localStorage, CHATBOT_FRIDGE_INGREDIENTS_STORAGE_KEY, [])

  if (!Array.isArray(storedIngredients)) {
    return [] as string[]
  }

  const uniqueLabels = new Set<string>()
  const nextIngredients: string[] = []

  storedIngredients.forEach((value) => {
    const normalizedLabel = normalizeIngredientLabel(value)
    if (!normalizedLabel || uniqueLabels.has(normalizedLabel)) {
      return
    }

    uniqueLabels.add(normalizedLabel)
    nextIngredients.push(normalizedLabel)
  })

  return nextIngredients
}

export function appendChatbotFridgeIngredients(labels: string[]) {
  if (!isBrowser()) {
    return [] as string[]
  }

  const nextSet = new Set(readChatbotFridgeIngredients())
  labels.forEach((label) => {
    const normalizedLabel = normalizeIngredientLabel(label)
    if (!normalizedLabel) return
    nextSet.add(normalizedLabel)
  })

  const nextIngredients = Array.from(nextSet)
  writeJsonStorage(window.localStorage, CHATBOT_FRIDGE_INGREDIENTS_STORAGE_KEY, nextIngredients)
  return nextIngredients
}

export function appendChatbotHistoryMessage(text: string, source: ChatbotHistorySource) {
  if (!isBrowser()) {
    return
  }

  const trimmedText = text.trim()
  if (!trimmedText) {
    return
  }

  const nextHistory = [
    ...readChatbotHistory(),
    {
      id: `chat-${Date.now()}`,
      source,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    },
  ].slice(-100)

  writeJsonStorage(window.localStorage, CHATBOT_HISTORY_STORAGE_KEY, nextHistory)
}

export function getAiUserDataSnapshot(): AiUserDataSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    route: isBrowser() ? window.location.hash || '#/' : '#/',
    profile: getUserProfile(),
    onboardingAnswers: readOnboardingAnswers(),
    recipeDetail: getAllPersistedRecipeDetailState(),
    groceryShoppingItems: isBrowser()
      ? readJsonStorage<ShoppingItem[]>(window.localStorage, GROCERY_SHOPPING_STORAGE_KEY, [])
      : [],
    chatbotFridgeIngredients: readChatbotFridgeIngredients(),
    chatbotHistory: readChatbotHistory(),
    communityWrite: readPersistedCommunityWriteState(),
    communityBoardMock: {
      posts: mockBoardPosts,
      detailPosts: mockBoardDetailPosts,
      popularPosts: mockBoardPopularPosts,
      comments: mockBoardComments,
    },
    points: {
      raw: getPointStateSnapshot(),
      balance: getPointBalanceSnapshot(),
    },
  }
}

export function registerAiDataDebugBridge() {
  if (!isBrowser()) {
    return
  }

  window.__ONEULDORAK_AI_DATA__ = getAiUserDataSnapshot
}

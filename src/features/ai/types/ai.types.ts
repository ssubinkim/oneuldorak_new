export const AI_FEATURES = [
  'today-lunchbox-recommendation',
  'weekly-lunchbox-plan',
  'ingredient-recipes',
  'today-recommended-ingredients',
  'leftover-ingredients',
  'buy-or-not',
  'fridge-photo-analysis',
] as const

export type AiFeature = typeof AI_FEATURES[number]
export type AiChatStatus = 'loading' | 'success' | 'error'
export type AiResponseSource = 'api' | 'mock' | 'fallback'
export type AnalysisType = 'menu' | 'receipt' | 'judge'

export type RecipeData = {
  title: string
  subtitle: string
  imageUrl?: string
  cookTime: string
  estimatedCost: string
  reason: string
}

type AiChatMessageBase = {
  id: string
  role: 'user' | 'assistant' | 'system'
  status: AiChatStatus
  feature?: AiFeature
  createdAt?: string
  source?: AiResponseSource
}

export type AiUserMessage = AiChatMessageBase & {
  type: 'user'
  role: 'user'
  status: 'success'
  text: string
}

export type AiTextMessage = AiChatMessageBase & {
  type: 'ai-text'
  role: 'assistant'
  status: 'success' | 'error'
  text: string
}

export type AiRecipeMessage = AiChatMessageBase & {
  type: 'ai-recipe'
  role: 'assistant'
  status: 'success'
  recipe: RecipeData
}

export type AiSuggestionMessage = AiChatMessageBase & {
  type: 'suggestions'
  role: 'assistant'
  status: 'success'
  items: string[]
}

export type AiLoadingMessage = AiChatMessageBase & {
  type: 'ai-loading'
  role: 'assistant'
  status: 'loading'
  text?: string
}

export type AiChatMessage =
  | AiUserMessage
  | AiTextMessage
  | AiRecipeMessage
  | AiSuggestionMessage
  | AiLoadingMessage

export type AiChatError = {
  code: string
  message: string
  recoverable: boolean
}

export type AiChatRequest = {
  message: string
  imageDataUrl?: string
  analysisType?: AnalysisType
  feature?: AiFeature
  forceMock?: boolean
  mockStatus?: AiChatStatus
}

export type AiChatResponse = {
  id: string
  feature: AiFeature
  status: AiChatStatus
  source: AiResponseSource
  text: string
  messages: AiChatMessage[]
  suggestions: string[]
  createdAt: string
  error?: AiChatError
  meta?: {
    fallbackReason?: string
    requestMessage?: string
    model?: string
  }
}

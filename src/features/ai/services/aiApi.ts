import { createAiChatMockResponse } from '../mocks/aiChat.mock'
import { createBuyAnalyzeMockResponse } from '../mocks/buyAnalyze.mock'
import { createFridgeAnalyzeMockResponse } from '../mocks/fridgeAnalyze.mock'
import {
  AI_FEATURES,
  type AiChatMessage,
  type AiChatRequest,
  type AiChatResponse,
  type AiChatStatus,
  type AiFeature,
} from '../types/ai.types'

const CHAT_API_URL = '/api/chat'

type LegacyChatApiSuccess = {
  text?: string
}

type LegacyChatApiError = {
  error?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAiFeature(value: unknown): value is AiFeature {
  return typeof value === 'string' && AI_FEATURES.includes(value as AiFeature)
}

function isAiChatStatus(value: unknown): value is AiChatStatus {
  return value === 'loading' || value === 'success' || value === 'error'
}

function readMockStatus() {
  const envStatus = import.meta.env.VITE_MOCK_AI_STATE
  return isAiChatStatus(envStatus) ? envStatus : 'success'
}

function shouldUseMockAi() {
  return import.meta.env.VITE_USE_MOCK_AI === 'true'
}

function createMockAiChatResponse(
  request: AiChatRequest,
  feature: AiFeature,
  status: AiChatStatus = 'success',
) {
  if (feature === 'buy-or-not') {
    return createBuyAnalyzeMockResponse(request, status)
  }

  if (feature === 'fridge-photo-analysis') {
    return createFridgeAnalyzeMockResponse(request, status)
  }

  return createAiChatMockResponse(request, feature, status)
}

export function inferAiFeature(request: AiChatRequest): AiFeature {
  if (request.feature) {
    return request.feature
  }

  const normalizedMessage = request.message.replace(/\s+/g, '').toLowerCase()

  if (request.imageDataUrl && request.analysisType !== 'judge') {
    return 'fridge-photo-analysis'
  }

  if (request.analysisType === 'judge') {
    return 'buy-or-not'
  }

  if (/weekly|week|주간|일주일|플랜/.test(normalizedMessage)) {
    return 'weekly-lunchbox-plan'
  }

  if (/ingredient|recipe|재료별|레시피/.test(normalizedMessage)) {
    return 'ingredient-recipes'
  }

  if (/recommendedingredients|추천재료|오늘추천재료/.test(normalizedMessage)) {
    return 'today-recommended-ingredients'
  }

  if (/leftover|남은재료|활용|자투리/.test(normalizedMessage)) {
    return 'leftover-ingredients'
  }

  if (/fridge|냉장고|사진분석/.test(normalizedMessage)) {
    return 'fridge-photo-analysis'
  }

  return 'today-lunchbox-recommendation'
}

function createFallbackResponse(request: AiChatRequest, error: unknown): AiChatResponse {
  const feature = inferAiFeature(request)
  const fallbackResponse = createMockAiChatResponse(request, feature, 'success')
  const fallbackReason = error instanceof Error ? error.message : 'Unknown AI API failure'

  return {
    ...fallbackResponse,
    source: 'fallback',
    messages: fallbackResponse.messages.map((message) => ({
      ...message,
      source: 'fallback',
    })),
    meta: {
      ...fallbackResponse.meta,
      fallbackReason,
    },
  }
}

function normalizeApiMessages(messages: unknown): AiChatMessage[] {
  return Array.isArray(messages)
    ? messages.filter((message): message is AiChatMessage => {
      return isRecord(message) && typeof message.id === 'string' && typeof message.type === 'string'
    })
    : []
}

function normalizeApiResponse(data: unknown, request: AiChatRequest): AiChatResponse {
  const feature = isRecord(data) && isAiFeature(data.feature) ? data.feature : inferAiFeature(request)
  const status = isRecord(data) && isAiChatStatus(data.status) ? data.status : 'success'
  const text = isRecord(data) && typeof data.text === 'string' ? data.text : ''
  const suggestions = isRecord(data) && Array.isArray(data.suggestions)
    ? data.suggestions.filter((item): item is string => typeof item === 'string')
    : []
  const messages = isRecord(data) ? normalizeApiMessages(data.messages) : []
  const createdAt = isRecord(data) && typeof data.createdAt === 'string'
    ? data.createdAt
    : new Date().toISOString()

  return {
    id: isRecord(data) && typeof data.id === 'string' ? data.id : `ai-response-${Date.now()}`,
    feature,
    status,
    source: 'api',
    text,
    messages: messages.length > 0
      ? messages
      : [{
        id: `ai-text-${Date.now()}`,
        type: 'ai-text',
        role: 'assistant',
        status: status === 'error' ? 'error' : 'success',
        feature,
        source: 'api',
        createdAt,
        text,
      }],
    suggestions,
    createdAt,
    meta: {
      requestMessage: request.message,
      model: isRecord(data) && isRecord(data.meta) && typeof data.meta.model === 'string'
        ? data.meta.model
        : undefined,
    },
  }
}

function createHttpError(status: number, data: LegacyChatApiError) {
  if (status === 502) {
    return new Error('API server is not connected. Start the backend with `cd server && npm run dev`.')
  }

  if (status === 404) {
    return new Error('AI API route was not found. Check that the backend server is running.')
  }

  if (status === 413) {
    return new Error('The image is too large. Try again with a smaller image.')
  }

  return new Error(data.error || `AI request failed. (status: ${status})`)
}

export async function requestAiChat(request: AiChatRequest): Promise<AiChatResponse> {
  const trimmedMessage = request.message.trim()
  const trimmedImageDataUrl = request.imageDataUrl?.trim()
  const normalizedRequest: AiChatRequest = {
    ...request,
    message: trimmedMessage,
    imageDataUrl: trimmedImageDataUrl,
  }
  const feature = inferAiFeature(normalizedRequest)
  const mockStatus = normalizedRequest.mockStatus ?? readMockStatus()

  if (!trimmedMessage && !trimmedImageDataUrl) {
    throw new Error('질문이나 이미지를 입력해 주세요.')
  }

  if (normalizedRequest.forceMock || shouldUseMockAi()) {
    return createMockAiChatResponse(normalizedRequest, feature, mockStatus)
  }

  try {
    // Keep provider secrets on the backend. The browser only calls this proxy route.
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: trimmedMessage,
        imageDataUrl: trimmedImageDataUrl,
        analysisType: normalizedRequest.analysisType,
        feature,
      }),
    })

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = (isJson
      ? await response.json()
      : { error: await response.text() }) as LegacyChatApiSuccess & LegacyChatApiError

    if (!response.ok) {
      const error = createHttpError(response.status, data)

      if (import.meta.env.DEV) {
        return createFallbackResponse(normalizedRequest, error)
      }

      throw error
    }

    return normalizeApiResponse(data, normalizedRequest)
  } catch (error) {
    if (import.meta.env.DEV) {
      return createFallbackResponse(normalizedRequest, error)
    }

    throw error
  }
}

export async function askGPT(message: string, options?: Omit<AiChatRequest, 'message'>) {
  const response = await requestAiChat({
    ...options,
    message,
  })

  if (response.status === 'error') {
    throw new Error(response.error?.message ?? response.text)
  }

  return response.text
}

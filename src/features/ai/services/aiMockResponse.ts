import { createAiChatMockResponse } from '../mocks/aiChat.mock'
import { createBuyAnalyzeMockResponse } from '../mocks/buyAnalyze.mock'
import { createFridgeAnalyzeMockResponse } from '../mocks/fridgeAnalyze.mock'
import type { AiChatRequest, AiChatResponse, AiChatStatus, AiFeature } from '../types/ai.types'
import { getErrorMessage } from './aiDebug'
import { inferAiFeature } from './aiFeatureRouter'

function isAiChatStatus(value: unknown): value is AiChatStatus {
  return value === 'loading' || value === 'success' || value === 'error'
}

export function readMockStatus() {
  const envStatus = import.meta.env.VITE_MOCK_AI_STATE
  return isAiChatStatus(envStatus) ? envStatus : 'success'
}

export function shouldUseMockAi() {
  return import.meta.env.VITE_USE_MOCK_AI === 'true'
}

export function createMockAiChatResponse(
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

export function createFallbackResponse(request: AiChatRequest, error: unknown): AiChatResponse {
  const feature = inferAiFeature(request)
  const fallbackResponse = createMockAiChatResponse(request, feature, 'success')
  const fallbackReason = getErrorMessage(error)

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

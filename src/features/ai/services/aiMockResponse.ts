import { createAiChatMockResponse, createAiTextMessage, createStatefulMockResponse } from '../mocks/aiChat.mock'
import { createBuyAnalyzeMockResponse } from '../mocks/buyAnalyze.mock'
import { createFridgeAnalyzeMockResponse } from '../mocks/fridgeAnalyze.mock'
import { createReceiptAnalyzeMockResult } from '../mocks/receiptAnalyze.mock'
import type { AiChatRequest, AiChatResponse, AiChatStatus, AiFeature } from '../types/ai.types'
import { getErrorMessage } from './aiDebug'
import { inferAiFeature } from './aiFeatureRouter'
import { buildReceiptAnalysisChatText } from './receiptChatFormatter'

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

function createReceiptAnalyzeMockResponse(request: AiChatRequest, status: AiChatStatus) {
  const feature: AiFeature = 'receipt-analysis'
  const result = createReceiptAnalyzeMockResult(request.imageDataUrl)
  const text = buildReceiptAnalysisChatText(result)

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '영수증을 읽고 지출을 정리하고 있어요.',
    errorMessage: '영수증 분석 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions: ['추천 메뉴 더 보여줘', '절약 포인트 더 알려줘', '장보기 목록으로 정리해줘'],
  })
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

  if (feature === 'receipt-analysis') {
    return createReceiptAnalyzeMockResponse(request, status)
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

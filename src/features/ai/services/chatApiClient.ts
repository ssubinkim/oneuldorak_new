import type { AiChatRequest, AiChatResponse } from '../types/ai.types'
import {
  AI_API_ENDPOINTS,
  type ApiErrorBody,
  type ChatApiRequestBody,
  type ChatApiSuccess,
} from './aiApiContracts'
import { getErrorMessage, logAiDebug } from './aiDebug'
import { inferAiFeature } from './aiFeatureRouter'
import {
  createFallbackResponse,
  createMockAiChatResponse,
  readMockStatus,
  shouldUseMockAi,
} from './aiMockResponse'
import { normalizeApiResponse } from './aiResponseNormalizer'

function createHttpError(status: number, data: ApiErrorBody) {
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
    logAiDebug('mock response', normalizedRequest, {
      source: 'mock',
      feature,
      mockStatus,
      reason: normalizedRequest.forceMock ? 'forceMock' : 'VITE_USE_MOCK_AI=true',
    })
    return createMockAiChatResponse(normalizedRequest, feature, mockStatus)
  }

  try {
    logAiDebug('api request', normalizedRequest, {
      source: 'api',
      feature,
    })

    // Keep provider secrets on the backend. The browser only calls this proxy route.
    const payload: ChatApiRequestBody = {
      message: trimmedMessage,
      imageDataUrl: trimmedImageDataUrl,
      analysisType: normalizedRequest.analysisType,
      feature,
    }

    const response = await fetch(AI_API_ENDPOINTS.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = (isJson
      ? await response.json()
      : { error: await response.text() }) as ChatApiSuccess & ApiErrorBody

    if (!response.ok) {
      const error = createHttpError(response.status, data)

      if (import.meta.env.DEV) {
        logAiDebug('fallback response', normalizedRequest, {
          source: 'fallback',
          feature,
          status: response.status,
          reason: getErrorMessage(error),
        })
        return createFallbackResponse(normalizedRequest, error)
      }

      throw error
    }

    const apiResponse = normalizeApiResponse(data, normalizedRequest)
    logAiDebug('api response', normalizedRequest, {
      source: apiResponse.source,
      feature: apiResponse.feature,
      status: apiResponse.status,
      suggestionCount: apiResponse.suggestions.length,
    })
    return apiResponse
  } catch (error) {
    if (import.meta.env.DEV) {
      logAiDebug('fallback response', normalizedRequest, {
        source: 'fallback',
        feature,
        reason: getErrorMessage(error),
      })
      return createFallbackResponse(normalizedRequest, error)
    }

    logAiDebug('api error', normalizedRequest, {
      source: 'api',
      feature,
      reason: getErrorMessage(error),
    })
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

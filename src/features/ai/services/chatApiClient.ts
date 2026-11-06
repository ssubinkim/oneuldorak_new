import type { AiChatRequest, AiChatResponse } from '../types/ai.types'
import { logAiDebug } from './aiDebug'
import { inferAiFeature } from './aiFeatureRouter'
import { createMockAiChatResponse, readMockStatus } from './aiMockResponse'

// Demo mode: all AI responses are generated locally, without API requests.
export async function requestAiChat(request: AiChatRequest): Promise<AiChatResponse> {
  const normalizedRequest: AiChatRequest = {
    ...request,
    message: request.message.trim(),
    imageDataUrl: request.imageDataUrl?.trim(),
  }

  if (!normalizedRequest.message && !normalizedRequest.imageDataUrl) {
    throw new Error('질문이나 이미지를 입력해 주세요.')
  }

  const feature = inferAiFeature(normalizedRequest)
  const mockStatus = normalizedRequest.mockStatus ?? readMockStatus()
  logAiDebug('mock response', normalizedRequest, {
    source: 'mock',
    feature,
    mockStatus,
    reason: 'API disconnected: local demo mode',
  })
  return createMockAiChatResponse(normalizedRequest, feature, mockStatus)
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

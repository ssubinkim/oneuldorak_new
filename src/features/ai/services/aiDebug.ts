import type { AiChatRequest } from '../types/ai.types'
import { inferAiFeature } from './aiFeatureRouter'

const AI_DEBUG_PREFIX = '[oneuldorak-ai]'

function shouldUseMockAi() {
  return import.meta.env.VITE_USE_MOCK_AI === 'true'
}

function shouldLogAiDebug() {
  return import.meta.env.DEV || import.meta.env.VITE_DEBUG_AI === 'true'
}

function getMessagePreview(message: string) {
  return message.length > 80 ? `${message.slice(0, 80)}...` : message
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown AI API failure'
}

export function logAiDebug(
  label: string,
  request: AiChatRequest,
  details: Record<string, unknown> = {},
) {
  if (!shouldLogAiDebug()) return

  console.info(`${AI_DEBUG_PREFIX} ${label}`, {
    source: details.source,
    feature: details.feature ?? request.feature ?? inferAiFeature(request),
    analysisType: request.analysisType,
    hasImage: Boolean(request.imageDataUrl),
    forceMock: Boolean(request.forceMock),
    mockEnv: shouldUseMockAi(),
    messagePreview: getMessagePreview(request.message),
    ...details,
  })
}

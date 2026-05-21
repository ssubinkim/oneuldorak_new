import type {
  AiChatMessage,
  AiChatRequest,
  AiChatResponse,
  AiChatStatus,
} from '../types/ai.types'
import { inferAiFeature, isAiFeature } from './aiFeatureRouter'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAiChatStatus(value: unknown): value is AiChatStatus {
  return value === 'loading' || value === 'success' || value === 'error'
}

function normalizeApiMessages(messages: unknown): AiChatMessage[] {
  return Array.isArray(messages)
    ? messages.filter((message): message is AiChatMessage => {
      return isRecord(message) && typeof message.id === 'string' && typeof message.type === 'string'
    })
    : []
}

export function normalizeApiResponse(data: unknown, request: AiChatRequest): AiChatResponse {
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

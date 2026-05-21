import type {
  AiChatResponse,
  AiFeature,
  AnalysisType,
} from '../types/ai.types'

export const AI_API_ENDPOINTS = {
  chat: '/api/chat',
  receiptAnalyze: '/api/receipt/analyze',
} as const

export type ChatApiRequestBody = {
  message: string
  imageDataUrl?: string
  analysisType?: AnalysisType
  feature: AiFeature
}

export type ChatApiSuccess = Partial<AiChatResponse> & {
  text?: string
}

export type ApiErrorBody = {
  error?: string
}

export type ReceiptAnalysisApiRequestBody = {
  imageDataUrl: string
}

export type ReceiptAnalysisApiSuccess = {
  result?: unknown
}

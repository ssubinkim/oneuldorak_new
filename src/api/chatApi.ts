import type { AiChatRequest, AnalysisType } from '../features/ai/types/ai.types'

export type AskGptOptions = Omit<AiChatRequest, 'message'>
export type { AnalysisType }
export { askGPT, inferAiFeature, requestAiChat } from '../features/ai/services/aiApi'

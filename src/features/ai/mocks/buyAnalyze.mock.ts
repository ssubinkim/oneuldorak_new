import type { AiChatRequest, AiChatResponse, AiChatStatus } from '../types/ai.types'
import { createAiTextMessage, createStatefulMockResponse } from './aiChat.mock'

export function createBuyAnalyzeMockResponse(
  request: AiChatRequest,
  status: AiChatStatus = 'success',
): AiChatResponse {
  const feature = 'buy-or-not'
  const text = [
    '판단: 오늘 기준으로는 보류해도 좋아요.',
    '이유: 비슷한 재료가 이미 있다면 이번 주 안에 쓰기 어려울 수 있어요.',
    '추천 행동: 2~3일 안에 만들 메뉴가 정해져 있으면 사고, 아니면 다음 장보기 때 다시 비교해 보세요.',
  ].join('\n')

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '살까 말까 기준을 정리하고 있어요.',
    errorMessage: '살까말까 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions: ['영양 기준으로 다시 판단해줘', '가성비만 보고 판단해줘', '사진 다시 분석할래'],
  })
}

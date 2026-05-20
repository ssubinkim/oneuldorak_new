import type { AiChatRequest, AiChatResponse, AiChatStatus } from '../types/ai.types'
import { createAiTextMessage, createStatefulMockResponse } from './aiChat.mock'

export function createFridgeAnalyzeMockResponse(
  request: AiChatRequest,
  status: AiChatStatus = 'success',
): AiChatResponse {
  const feature = 'fridge-photo-analysis'
  const hasImage = Boolean(request.imageDataUrl)
  const text = [
    hasImage ? '사진 기준으로 냉장고 재료를 목업 분석했어요.' : '사진이 없어서 예시 냉장고 기준으로 목업 분석했어요.',
    '확인된 재료: 계란, 김치, 양배추, 두부',
    '추천 메뉴: 김치볶음밥, 양배추 계란볶음, 두부 덮밥',
    '먼저 쓸 재료: 김치와 양배추처럼 수분이 많은 재료를 우선 사용해 주세요.',
  ].join('\n')

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '냉장고 사진에서 재료를 확인하고 있어요.',
    errorMessage: '냉장고 사진 분석 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions: ['이 재료로 레시피 추천해줘', '상하기 쉬운 순서로 정리해줘', '오늘 도시락 추천해줘'],
  })
}

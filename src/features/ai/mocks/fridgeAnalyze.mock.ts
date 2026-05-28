import type { AiChatRequest, AiChatResponse, AiChatStatus } from '../types/ai.types'
import { createAiTextMessage, createStatefulMockResponse } from './aiChat.mock'

export function createFridgeAnalyzeMockResponse(
  request: AiChatRequest,
  status: AiChatStatus = 'success',
): AiChatResponse {
  const feature = 'fridge-photo-analysis'
  const hasImage = Boolean(request.imageDataUrl)
  const normalizedMessage = request.message.replace(/\s+/g, '').toLowerCase()
  let text = [
    hasImage ? '사진 기준으로 냉장고 재료를 목업 분석했어요.' : '사진이 없어서 예시 냉장고 기준으로 목업 분석했어요.',
    '확인된 재료: 당근, 계란',
    '추천 메뉴: 당근 계란볶음밥, 당근 계란말이 도시락, 당근 라페 샌드위치',
    '먼저 쓸 재료: 손질한 당근은 수분이 마르기 쉬우니 먼저 사용하고, 계란은 냉장 보관해 단백질 보충용으로 활용해 주세요.',
  ].join('\n')
  let suggestions = ['이 재료로 레시피 추천해줘', '상하기 쉬운 순서로 정리해줘', '오늘 도시락 추천해줘']

  if (/상하기|순서|먼저|보관/.test(normalizedMessage)) {
    text = [
      '사진에서 확인한 재료를 상하기 쉬운 순서로 정리했어요.',
      '1. 당근: 이미 손질했거나 표면이 마르기 시작했다면 먼저 볶음밥이나 라페로 쓰세요.',
      '2. 계란: 냉장 보관 상태가 괜찮다면 도시락 단백질 보충용으로 2~3일 안에 활용해도 좋아요.',
    ].join('\n')
    suggestions = ['오늘 도시락 추천해줘', '이 재료로 레시피 추천해줘', '남은 재료 활용으로 바꿔줘']
  } else if (/레시피|요리|메뉴/.test(normalizedMessage)) {
    text = [
      '사진 속 재료로 바로 만들기 쉬운 레시피는 당근 계란볶음밥이에요.',
      '당근을 잘게 썰어 먼저 볶고, 밥과 계란을 넣으면 색감과 단백질이 같이 보완돼요.',
      '간장이나 소금으로만 간해도 도시락 반찬 없이 담기 쉬워요.',
    ].join('\n')
    suggestions = ['상하기 쉬운 순서로 정리해줘', '더 저렴한 메뉴로 바꿔줘', '오늘 도시락 추천해줘']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '냉장고 사진에서 재료를 확인하고 있어요.',
    errorMessage: '냉장고 사진 분석 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions,
  })
}

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
    '확인된 재료: 계란, 김치, 양배추, 두부',
    '추천 메뉴: 김치볶음밥, 양배추 계란볶음, 두부 덮밥',
    '먼저 쓸 재료: 김치와 양배추처럼 수분이 많은 재료를 우선 사용해 주세요.',
  ].join('\n')
  let suggestions = ['이 재료로 레시피 추천해줘', '상하기 쉬운 순서로 정리해줘', '오늘 도시락 추천해줘']

  if (/상하기|순서|먼저|보관/.test(normalizedMessage)) {
    text = [
      '사진에서 확인한 재료를 상하기 쉬운 순서로 정리했어요.',
      '1. 양배추: 손질되어 있으면 먼저 볶음이나 샐러드로 쓰세요.',
      '2. 두부: 개봉했다면 오늘이나 내일 안에 덮밥으로 쓰는 게 좋아요.',
      '3. 계란: 비교적 여유가 있어 도시락 단백질 보충용으로 남겨도 괜찮아요.',
      '4. 김치: 보관성이 좋아 마지막에 볶음밥으로 활용해도 좋아요.',
    ].join('\n')
    suggestions = ['오늘 도시락 추천해줘', '이 재료로 레시피 추천해줘', '남은 재료 활용으로 바꿔줘']
  } else if (/레시피|요리|메뉴/.test(normalizedMessage)) {
    text = [
      '사진 속 재료로 바로 만들기 쉬운 레시피는 김치볶음밥이에요.',
      '김치와 밥을 먼저 볶고, 계란을 올리면 단백질이 보완돼요.',
      '양배추가 남아 있다면 잘게 썰어 같이 볶으면 식감이 좋아져요.',
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

import type { AiChatRequest, AiChatResponse, AiChatStatus } from '../types/ai.types'
import { createAiTextMessage, createStatefulMockResponse } from './aiChat.mock'

export function createBuyAnalyzeMockResponse(
  request: AiChatRequest,
  status: AiChatStatus = 'success',
): AiChatResponse {
  const feature = 'buy-or-not'
  const normalizedMessage = request.message.replace(/\s+/g, '').toLowerCase()
  let text = [
    '판단: 오늘 기준으로는 보류해도 좋아요.',
    '이유: 비슷한 재료가 이미 있다면 이번 주 안에 쓰기 어려울 수 있어요.',
    '추천 행동: 2~3일 안에 만들 메뉴가 정해져 있으면 사고, 아니면 다음 장보기 때 다시 비교해 보세요.',
  ].join('\n')
  let suggestions = ['영양 기준으로 다시 판단해줘', '가성비만 보고 판단해줘', '사진 다시 분석할래']

  if (/영양|단백질|칼로리|건강/.test(normalizedMessage)) {
    text = [
      '판단: 영양 기준으로는 단백질이나 채소를 보완해 주는 재료라면 사도 좋아요.',
      '이유: 이번 주 도시락에 탄수화물만 많다면 계란, 두부, 닭가슴살처럼 균형을 맞추는 재료가 도움이 돼요.',
      '추천 행동: 이미 단백질 재료가 충분하면 보류하고, 부족하면 소용량으로만 사세요.',
    ].join('\n')
    suggestions = ['가성비만 보고 판단해줘', '오늘 메뉴 기준으로 다시 판단해줘', '사진 다시 분석할래']
  } else if (/가성비|가격|저렴|예산|싼/.test(normalizedMessage)) {
    text = [
      '판단: 가성비 기준으로는 바로 쓸 계획이 없으면 보류가 좋아요.',
      '이유: 할인 중이어도 이번 주 안에 쓰지 못하면 보관 부담이 생겨 실제 절약 효과가 줄어들 수 있어요.',
      '추천 행동: 2회 이상 쓸 메뉴가 떠오르면 사고, 아니면 계란이나 두부처럼 활용도가 높은 재료를 우선 사세요.',
    ].join('\n')
    suggestions = ['영양 기준으로 다시 판단해줘', '더 저렴한 대안 알려줘', '사진 다시 분석할래']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '살까 말까 기준을 정리하고 있어요.',
    errorMessage: '살까말까 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions,
  })
}

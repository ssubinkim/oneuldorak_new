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
    '이유: 사진 속 텀블러는 도시락 음료를 챙길 때 유용하지만, 이미 물병이나 보온병이 있다면 바로 필요한 구매는 아니에요.',
    '도시락 활용도: 따뜻한 차나 아이스 음료를 오래 보관할 수 있어 외출 도시락에는 도움이 돼요.',
    '가격/가성비 체크: 브랜드 텀블러는 가격대가 높을 수 있으니 용량, 보온 시간, 세척 편의성을 같이 비교해 보세요.',
    '추천 행동: 이번 주에 매일 음료를 챙길 계획이 있으면 사고, 아니라면 장바구니에 넣어두고 할인 때 다시 판단해 보세요.',
  ].join('\n')
  let suggestions = ['활용도 기준으로 다시 판단해줘', '가성비만 보고 판단해줘', '사진 다시 분석할래']

  if (/활용도|보온|보냉|음료|텀블러/.test(normalizedMessage)) {
    text = [
      '판단: 활용도 기준으로는 사도 좋아요.',
      '이유: 도시락과 함께 따뜻한 차나 커피를 자주 챙긴다면 사용 빈도가 높아요.',
      '도시락 활용도: 보온/보냉이 되는 텀블러는 점심 이동 시간과 사무실 보관 상황에서 꽤 실용적이에요.',
      '가격/가성비 체크: 이미 비슷한 용량의 텀블러가 없다면 활용 대비 만족도가 높을 수 있어요.',
      '추천 행동: 매일 쓸 용도가 분명하면 구매하고, 가끔만 쓴다면 더 가벼운 제품도 비교해 보세요.',
    ].join('\n')
    suggestions = ['가성비만 보고 판단해줘', '오늘 메뉴 기준으로 다시 판단해줘', '사진 다시 분석할래']
  } else if (/가성비|가격|저렴|예산|싼/.test(normalizedMessage)) {
    text = [
      '판단: 가성비 기준으로는 보류해도 좋아요.',
      '이유: 텀블러는 한 번 사면 오래 쓰지만, 가격이 높으면 실제 사용 빈도가 가성비를 좌우해요.',
      '도시락 활용도: 음료를 자주 챙기는 사람에게는 좋지만, 물만 가끔 담는 용도라면 과할 수 있어요.',
      '가격/가성비 체크: 같은 용량의 보온병, 세척 쉬운 텀블러와 가격을 비교한 뒤 사는 게 좋아요.',
      '추천 행동: 20% 이상 할인이나 매일 사용할 루틴이 있을 때 구매하세요.',
    ].join('\n')
    suggestions = ['활용도 기준으로 다시 판단해줘', '더 저렴한 대안 알려줘', '사진 다시 분석할래']
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

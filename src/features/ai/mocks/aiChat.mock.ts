import chamchiMayoImage from '../../../assets/images/food_imges/chamchimayo.png'
import kimchiRiceImage from '../../../assets/images/food_imges/kimbok.png'
import type {
  AiChatError,
  AiChatMessage,
  AiChatRequest,
  AiChatResponse,
  AiChatStatus,
  AiFeature,
  AiLoadingMessage,
  AiRecipeMessage,
  AiResponseSource,
  AiSuggestionMessage,
  AiTextMessage,
  RecipeData,
} from '../types/ai.types'

type MockResponseInput = {
  feature: AiFeature
  status: AiChatStatus
  text: string
  messages: AiChatMessage[]
  suggestions?: string[]
  loadingText?: string
  errorMessage?: string
  source?: AiResponseSource
  requestMessage?: string
}

function createMockId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createAiTextMessage(feature: AiFeature, text: string, status: 'success' | 'error' = 'success'): AiTextMessage {
  return {
    id: createMockId('ai-text'),
    type: 'ai-text',
    role: 'assistant',
    status,
    feature,
    source: 'mock',
    createdAt: new Date().toISOString(),
    text,
  }
}

export function createAiRecipeMessage(feature: AiFeature, recipe: RecipeData): AiRecipeMessage {
  return {
    id: createMockId('ai-recipe'),
    type: 'ai-recipe',
    role: 'assistant',
    status: 'success',
    feature,
    source: 'mock',
    createdAt: new Date().toISOString(),
    recipe,
  }
}

export function createAiSuggestionMessage(feature: AiFeature, items: string[]): AiSuggestionMessage {
  return {
    id: createMockId('ai-suggestions'),
    type: 'suggestions',
    role: 'assistant',
    status: 'success',
    feature,
    source: 'mock',
    createdAt: new Date().toISOString(),
    items,
  }
}

function createAiLoadingMessage(feature: AiFeature, text?: string): AiLoadingMessage {
  return {
    id: createMockId('ai-loading'),
    type: 'ai-loading',
    role: 'assistant',
    status: 'loading',
    feature,
    source: 'mock',
    createdAt: new Date().toISOString(),
    text,
  }
}

function createMockError(message: string): AiChatError {
  return {
    code: 'MOCK_AI_ERROR',
    message,
    recoverable: true,
  }
}

export function createStatefulMockResponse(input: MockResponseInput): AiChatResponse {
  if (input.status === 'loading') {
    const text = input.loadingText ?? 'AI가 답변을 준비하고 있어요.'

    return {
      id: createMockId('ai-response'),
      feature: input.feature,
      status: 'loading',
      source: input.source ?? 'mock',
      text,
      messages: [createAiLoadingMessage(input.feature, text)],
      suggestions: [],
      createdAt: new Date().toISOString(),
      meta: {
        requestMessage: input.requestMessage,
        model: 'mock-ai',
      },
    }
  }

  if (input.status === 'error') {
    const text = input.errorMessage ?? 'AI 목업 응답을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.'

    return {
      id: createMockId('ai-response'),
      feature: input.feature,
      status: 'error',
      source: input.source ?? 'mock',
      text,
      messages: [createAiTextMessage(input.feature, text, 'error')],
      suggestions: [],
      createdAt: new Date().toISOString(),
      error: createMockError(text),
      meta: {
        requestMessage: input.requestMessage,
        model: 'mock-ai',
      },
    }
  }

  const suggestions = input.suggestions ?? []

  return {
    id: createMockId('ai-response'),
    feature: input.feature,
    status: 'success',
    source: input.source ?? 'mock',
    text: input.text,
    messages: suggestions.length > 0
      ? [...input.messages, createAiSuggestionMessage(input.feature, suggestions)]
      : input.messages,
    suggestions,
    createdAt: new Date().toISOString(),
    meta: {
      requestMessage: input.requestMessage,
      model: 'mock-ai',
    },
  }
}

function normalizeRequestMessage(request: AiChatRequest) {
  return request.message.replace(/\s+/g, '').toLowerCase()
}

function requestMatches(request: AiChatRequest, pattern: RegExp) {
  return pattern.test(normalizeRequestMessage(request))
}

function createTodayLunchboxRecommendationMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'today-lunchbox-recommendation'
  let text = '오늘은 참치마요 주먹밥 도시락을 추천해요. 준비가 빠르고, 식어도 맛이 안정적이에요.'
  let recipe: RecipeData = {
    title: '참치마요 주먹밥 도시락',
    subtitle: '10분 완성, 편의점 재료로도 가능한 든든한 메뉴',
    imageUrl: chamchiMayoImage,
    cookTime: '10분',
    estimatedCost: '약 2,500원',
    reason: '참치캔, 김, 밥, 마요네즈만 있으면 만들 수 있고 이동 중에도 먹기 편해요.',
  }
  let suggestions = ['주간 도시락 플랜도 보여줘', '남은 재료로 다시 추천해줘', '레시피 보러 갈래']

  if (requestMatches(request, /저렴|싸게|가격|예산|가성비/)) {
    text = '더 저렴하게 바꾸면 계란 간장밥 도시락이 좋아요. 계란과 밥만으로도 충분하고, 김치나 남은 채소를 조금 곁들이면 맛이 덜 심심해요.'
    recipe = {
      title: '계란 간장밥 도시락',
      subtitle: '재료비를 낮춘 기본 도시락',
      imageUrl: kimchiRiceImage,
      cookTime: '8분',
      estimatedCost: '약 1,200원',
      reason: '계란, 밥, 간장만 있으면 가능해서 재료비가 낮고 남은 반찬을 곁들이기 쉬워요.',
    }
    suggestions = ['단백질을 더해줘', '주간 플랜도 저렴하게 짜줘', '남은 재료로 바꿔줘']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '오늘 먹기 좋은 도시락을 고르고 있어요.',
    errorMessage: '오늘 도시락 추천 목업 응답을 불러오지 못했어요.',
    messages: [
      createAiTextMessage(feature, text),
      createAiRecipeMessage(feature, recipe),
    ],
    suggestions,
  })
}

function createWeeklyLunchboxPlanMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'weekly-lunchbox-plan'
  let text = [
    '이번 주 도시락은 재료가 겹치도록 짜봤어요.',
    '월: 참치마요 주먹밥',
    '화: 김치볶음밥',
    '수: 계란 간장밥 도시락',
    '목: 불고기 덮밥',
    '금: 남은 채소 볶음면',
  ].join('\n')
  let suggestions = ['장보기 재료로 정리해줘', '더 저렴하게 바꿔줘', '오늘 메뉴만 다시 추천해줘']

  if (requestMatches(request, /장보기|구매목록|재료로정리|리스트/)) {
    text = [
      '이번 주 플랜 기준 장보기 재료를 정리해봤어요.',
      '필수: 계란 6구, 참치캔 2개, 김치, 양배추, 두부',
      '있으면 좋은 재료: 김, 대파, 간장, 마요네즈',
      '먼저 확인할 것: 집에 밥, 김치, 간장이 있으면 새로 살 필요가 적어요.',
    ].join('\n')
    suggestions = ['예산 1만원 안으로 줄여줘', '보관 쉬운 재료만 남겨줘', '오늘 메뉴만 다시 추천해줘']
  } else if (requestMatches(request, /저렴|싸게|가격|예산|가성비/)) {
    text = [
      '더 저렴한 주간 플랜으로 바꿔봤어요.',
      '월: 계란 간장밥',
      '화: 김치볶음밥',
      '수: 두부 덮밥',
      '목: 양배추 계란볶음',
      '금: 참치 김 주먹밥',
      '비싼 고기 메뉴를 줄이고 계란, 두부, 참치캔 중심으로 맞췄어요.',
    ].join('\n')
    suggestions = ['장보기 재료로 정리해줘', '단백질을 더해줘', '오늘 메뉴만 다시 추천해줘']
  } else if (requestMatches(request, /오늘메뉴|메뉴만|오늘만|다시추천/)) {
    text = '오늘 메뉴만 다시 고르면 김치볶음밥 도시락이 좋아요. 주간 플랜 재료를 크게 벗어나지 않고, 남은 밥과 김치를 바로 쓸 수 있어요.'
    suggestions = ['더 가볍게 바꿔줘', '더 저렴하게 바꿔줘', '레시피 보러 갈래']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '일주일 도시락 흐름을 맞추고 있어요.',
    errorMessage: '주간 도시락 플랜 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions,
  })
}

function createIngredientRecipesMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'ingredient-recipes'
  const ingredientHint = requestMatches(request, /단백질|다른|조합|추천|보여줘|바꿔줘/)
    ? '지금 있는 재료'
    : request.message.trim() || '지금 있는 재료'
  let text = `${ingredientHint} 기준으로는 김치볶음밥이 가장 만들기 쉬워요. 밥과 김치만 있어도 기본 맛이 나고, 계란을 올리면 더 든든해져요.`
  let suggestions = ['다른 재료 조합도 추천해줘', '단백질을 더해줘', '남은 재료 활용으로 바꿔줘']

  if (requestMatches(request, /단백질/)) {
    text = '단백질을 더하려면 계란, 두부, 참치캔 중 하나를 붙이면 좋아요. 김치볶음밥에는 계란 프라이가 가장 간단하고, 두부는 따로 구워서 반찬처럼 담으면 물기가 덜 생겨요.'
    suggestions = ['더 저렴한 단백질로 골라줘', '두부로 레시피 짜줘', '오늘 도시락으로 바꿔줘']
  } else if (requestMatches(request, /다른|조합/)) {
    text = '다른 조합으로는 두부 양배추 덮밥이 좋아요. 두부로 단백질을 채우고 양배추로 부피를 늘리면 가볍지만 든든한 도시락이 돼요.'
    suggestions = ['양배추 레시피 더 보여줘', '더 든든하게 바꿔줘', '남은 재료 활용으로 바꿔줘']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '재료 조합에 맞는 레시피를 찾고 있어요.',
    errorMessage: '재료별 레시피 목업 응답을 불러오지 못했어요.',
    messages: [
      createAiTextMessage(feature, text),
      createAiRecipeMessage(feature, {
        title: '김치볶음밥 도시락',
        subtitle: '밥, 김치, 계란으로 끝내는 기본 레시피',
        imageUrl: kimchiRiceImage,
        cookTime: '12분',
        estimatedCost: '약 1,800원',
        reason: '재료가 적어도 실패 확률이 낮고, 냉장고 속 자투리 채소를 같이 넣기 좋아요.',
      }),
    ],
    suggestions,
  })
}

function createTodayRecommendedIngredientsMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'today-recommended-ingredients'
  let text = [
    '오늘 추천 재료는 계란, 두부, 양배추예요.',
    '계란은 빠르게 단백질을 채우기 좋고, 두부는 반찬이나 덮밥으로 바꾸기 쉬워요.',
    '양배추는 오래 보관되고 볶음, 샐러드, 국물 메뉴에 모두 어울려요.',
  ].join('\n')
  let suggestions = ['이 재료로 레시피 추천해줘', '예산 5천원 안으로 골라줘', '보관 쉬운 재료만 보여줘']

  if (requestMatches(request, /예산|5천|저렴|가성비|가격/)) {
    text = [
      '예산 5천원 안이면 계란, 두부, 콩나물을 추천해요.',
      '계란은 여러 끼에 나눠 쓰기 좋고, 두부와 콩나물은 가격 대비 양이 넉넉해요.',
      '오늘 도시락은 두부 덮밥이나 콩나물 계란볶음밥으로 이어가기 좋아요.',
    ].join('\n')
    suggestions = ['이 재료로 레시피 추천해줘', '보관 쉬운 순서로 정리해줘', '오늘 도시락 추천해줘']
  } else if (requestMatches(request, /보관|쉬운|상하기|오래/)) {
    text = [
      '보관이 쉬운 재료만 고르면 계란, 두부, 양배추가 좋아요.',
      '계란은 냉장 보관 기간이 비교적 길고, 양배추는 필요한 만큼 잘라 쓰기 좋아요.',
      '두부는 개봉 전 기준으로 보고, 개봉했다면 빨리 덮밥이나 반찬으로 쓰는 편이 좋아요.',
    ].join('\n')
    suggestions = ['상하기 쉬운 순서로 정리해줘', '이 재료로 레시피 추천해줘', '예산도 같이 봐줘']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '오늘 사두면 좋은 재료를 고르고 있어요.',
    errorMessage: '오늘 추천 재료 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions,
  })
}

function createLeftoverIngredientsMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'leftover-ingredients'
  let text = [
    '남은 재료는 볶음밥이나 덮밥으로 묶으면 버리는 양을 줄이기 좋아요.',
    '자투리 채소는 잘게 썰어 먼저 볶고, 밥이나 면을 넣은 뒤 간장 반 스푼으로 마무리해 보세요.',
    '양이 애매하면 계란이나 참치캔을 더하면 한 끼 도시락으로 충분해져요.',
  ].join('\n')
  let suggestions = ['냉장고 사진으로 분석할래', '오늘 도시락으로 바꿔줘', '재료별 레시피도 보여줘']

  if (requestMatches(request, /상하기|순서|먼저|보관/)) {
    text = [
      '남은 재료는 상하기 쉬운 순서대로 쓰면 좋아요.',
      '1. 잎채소와 손질한 채소',
      '2. 두부처럼 개봉한 단백질 재료',
      '3. 김치, 장아찌처럼 보관성이 있는 반찬',
      '오늘은 잎채소나 손질 채소부터 볶음밥에 넣어 쓰는 쪽을 추천해요.',
    ].join('\n')
    suggestions = ['오늘 도시락으로 바꿔줘', '재료별 레시피도 보여줘', '장보기는 뭐 줄일까']
  }

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '남은 재료를 최대한 살릴 방법을 찾고 있어요.',
    errorMessage: '남은 재료 활용 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions,
  })
}

export function createAiChatMockResponse(
  request: AiChatRequest,
  feature: AiFeature,
  status: AiChatStatus = 'success',
): AiChatResponse {
  const mockBuilders: Partial<Record<AiFeature, (request: AiChatRequest, status: AiChatStatus) => AiChatResponse>> = {
    'today-lunchbox-recommendation': createTodayLunchboxRecommendationMock,
    'weekly-lunchbox-plan': createWeeklyLunchboxPlanMock,
    'ingredient-recipes': createIngredientRecipesMock,
    'today-recommended-ingredients': createTodayRecommendedIngredientsMock,
    'leftover-ingredients': createLeftoverIngredientsMock,
  }

  return (mockBuilders[feature] ?? createTodayLunchboxRecommendationMock)(request, status)
}

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

function createTodayLunchboxRecommendationMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'today-lunchbox-recommendation'
  const text = '오늘은 참치마요 주먹밥 도시락을 추천해요. 준비가 빠르고, 식어도 맛이 안정적이에요.'

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '오늘 먹기 좋은 도시락을 고르고 있어요.',
    errorMessage: '오늘 도시락 추천 목업 응답을 불러오지 못했어요.',
    messages: [
      createAiTextMessage(feature, text),
      createAiRecipeMessage(feature, {
        title: '참치마요 주먹밥 도시락',
        subtitle: '10분 완성, 편의점 재료로도 가능한 든든한 메뉴',
        imageUrl: chamchiMayoImage,
        cookTime: '10분',
        estimatedCost: '약 2,500원',
        reason: '참치캔, 김, 밥, 마요네즈만 있으면 만들 수 있고 이동 중에도 먹기 편해요.',
      }),
    ],
    suggestions: ['주간 도시락 플랜도 보여줘', '남은 재료로 다시 추천해줘', '레시피 보러 갈래'],
  })
}

function createWeeklyLunchboxPlanMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'weekly-lunchbox-plan'
  const text = [
    '이번 주 도시락은 재료가 겹치도록 짜봤어요.',
    '월: 참치마요 주먹밥',
    '화: 김치볶음밥',
    '수: 계란 간장밥 도시락',
    '목: 불고기 덮밥',
    '금: 남은 채소 볶음면',
  ].join('\n')

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '일주일 도시락 흐름을 맞추고 있어요.',
    errorMessage: '주간 도시락 플랜 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions: ['장보기 재료로 정리해줘', '더 저렴하게 바꿔줘', '오늘 메뉴만 다시 추천해줘'],
  })
}

function createIngredientRecipesMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'ingredient-recipes'
  const ingredientHint = request.message.trim() || '지금 있는 재료'
  const text = `${ingredientHint} 기준으로는 김치볶음밥이 가장 만들기 쉬워요. 밥과 김치만 있어도 기본 맛이 나고, 계란을 올리면 더 든든해져요.`

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
    suggestions: ['다른 재료 조합도 추천해줘', '단백질을 더해줘', '남은 재료 활용으로 바꿔줘'],
  })
}

function createTodayRecommendedIngredientsMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'today-recommended-ingredients'
  const text = [
    '오늘 추천 재료는 계란, 두부, 양배추예요.',
    '계란은 빠르게 단백질을 채우기 좋고, 두부는 반찬이나 덮밥으로 바꾸기 쉬워요.',
    '양배추는 오래 보관되고 볶음, 샐러드, 국물 메뉴에 모두 어울려요.',
  ].join('\n')

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '오늘 사두면 좋은 재료를 고르고 있어요.',
    errorMessage: '오늘 추천 재료 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions: ['이 재료로 레시피 추천해줘', '예산 5천원 안으로 골라줘', '보관 쉬운 재료만 보여줘'],
  })
}

function createLeftoverIngredientsMock(request: AiChatRequest, status: AiChatStatus): AiChatResponse {
  const feature = 'leftover-ingredients'
  const text = [
    '남은 재료는 볶음밥이나 덮밥으로 묶으면 버리는 양을 줄이기 좋아요.',
    '자투리 채소는 잘게 썰어 먼저 볶고, 밥이나 면을 넣은 뒤 간장 반 스푼으로 마무리해 보세요.',
    '양이 애매하면 계란이나 참치캔을 더하면 한 끼 도시락으로 충분해져요.',
  ].join('\n')

  return createStatefulMockResponse({
    feature,
    status,
    text,
    requestMessage: request.message,
    loadingText: '남은 재료를 최대한 살릴 방법을 찾고 있어요.',
    errorMessage: '남은 재료 활용 목업 응답을 불러오지 못했어요.',
    messages: [createAiTextMessage(feature, text)],
    suggestions: ['냉장고 사진으로 분석할래', '오늘 도시락으로 바꿔줘', '재료별 레시피도 보여줘'],
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

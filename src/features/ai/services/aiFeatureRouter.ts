import { AI_FEATURES, type AiChatRequest, type AiFeature } from '../types/ai.types'

export function isAiFeature(value: unknown): value is AiFeature {
  return typeof value === 'string' && AI_FEATURES.includes(value as AiFeature)
}

function normalizeFeatureText(value: string) {
  return value.replace(/\s+/g, '').toLowerCase()
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(normalizeFeatureText(keyword)))
}

export function inferAiFeature(request: AiChatRequest): AiFeature {
  if (request.feature) {
    return request.feature
  }

  const normalizedMessage = normalizeFeatureText(request.message)

  if (request.imageDataUrl && request.analysisType !== 'judge') {
    if (
      request.analysisType === 'receipt'
      || includesAny(normalizedMessage, ['receipt', '영수증', '구매내역', '지출분석'])
    ) {
      return 'receipt-analysis'
    }

    return 'fridge-photo-analysis'
  }

  if (
    request.analysisType === 'receipt'
    || includesAny(normalizedMessage, ['receipt', '영수증', '구매내역', '지출분석'])
  ) {
    return 'receipt-analysis'
  }

  if (
    request.analysisType === 'judge'
    || includesAny(normalizedMessage, ['buyornot', '살까말까', '사도될까', '구매판단'])
  ) {
    return 'buy-or-not'
  }

  if (includesAny(normalizedMessage, ['weekly', 'week', '주간', '일주일', '플랜'])) {
    return 'weekly-lunchbox-plan'
  }

  if (includesAny(normalizedMessage, ['recommendedingredients', '추천재료', '오늘추천재료'])) {
    return 'today-recommended-ingredients'
  }

  if (includesAny(normalizedMessage, ['leftover', '남은재료', '활용', '자투리'])) {
    return 'leftover-ingredients'
  }

  if (includesAny(normalizedMessage, ['ingredient', 'recipe', '재료별', '레시피'])) {
    return 'ingredient-recipes'
  }

  if (includesAny(normalizedMessage, ['fridge', '냉장고', '사진분석'])) {
    return 'fridge-photo-analysis'
  }

  return 'today-lunchbox-recommendation'
}

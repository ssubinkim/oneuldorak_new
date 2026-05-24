import type { ReceiptAnalysisResult } from '../types/ai.types'
import {
  AI_API_ENDPOINTS,
  type ApiErrorBody,
  type ReceiptAnalysisApiRequestBody,
  type ReceiptAnalysisApiSuccess,
} from './aiApiContracts'
import { createReceiptAnalyzeMockResult } from '../mocks/receiptAnalyze.mock'
import { shouldUseMockAi } from './aiMockResponse'

export const RECEIPT_IMAGE_MAX_DATA_URL_LENGTH = 3_600_000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined
}

function readCategory(value: unknown): ReceiptAnalysisResult['items'][number]['category'] {
  const category = readString(value)
  if (
    category === 'vegetable'
    || category === 'meat'
    || category === 'seafood'
    || category === 'dairy'
    || category === 'grain'
    || category === 'snack'
    || category === 'drink'
    || category === 'etc'
  ) {
    return category
  }
  return undefined
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map(readString).filter((item): item is string => Boolean(item))
    : []
}

function normalizeReceiptResult(value: unknown): ReceiptAnalysisResult {
  if (!isRecord(value)) {
    throw new Error('영수증 분석 결과 형식이 올바르지 않습니다.')
  }

  const items = Array.isArray(value.items)
    ? value.items
      .filter(isRecord)
      .map((item) => ({
        name: readString(item.name) ?? '확인 어려움',
        price: readNumber(item.price),
        quantity: readString(item.quantity),
        category: readCategory(item.category),
        lunchboxUsable: readBoolean(item.lunchboxUsable),
      }))
    : []

  const recommendedMenus = Array.isArray(value.recommendedMenus)
    ? value.recommendedMenus
      .filter(isRecord)
      .map((menu) => ({
        name: readString(menu.name) ?? '추천 메뉴 확인 어려움',
        reason: readString(menu.reason) ?? '영수증 정보가 부족해 이유를 확인하기 어려워요.',
        ingredients: readStringArray(menu.ingredients),
      }))
    : []

  return {
    storeName: readString(value.storeName),
    purchasedAt: readString(value.purchasedAt),
    totalAmount: readNumber(value.totalAmount),
    items,
    lunchboxIngredients: readStringArray(value.lunchboxIngredients),
    savingTips: readStringArray(value.savingTips),
    recommendedMenus,
    summary: readString(value.summary) ?? '영수증 내용을 확인했어요.',
    nextAction: readString(value.nextAction) ?? '도시락에 쓸 재료를 골라 보관 목록에 추가해보세요.',
  }
}

function createReceiptHttpError(status: number, data: ApiErrorBody) {
  if (status === 413) {
    return new Error('이미지가 너무 커요. 영수증을 조금 더 가까이 찍거나 낮은 해상도로 다시 시도해주세요.')
  }

  if (status === 404 || status === 502) {
    return new Error('영수증 분석 서버가 연결되지 않았어요. API 서버가 실행 중인지 확인해주세요.')
  }

  return new Error(data.error || '영수증 분석에 실패했어요. 영수증을 더 밝게 찍어 다시 시도해주세요.')
}

function shouldUseReceiptMockFallbackInDev(status: number | null) {
  if (!import.meta.env.DEV) return false
  if (status === null) return true
  return status === 404 || status === 502 || status === 503 || status >= 500
}

function logReceiptDevFallback(status: number | null, error: unknown) {
  if (!import.meta.env.DEV) return
  const reason = error instanceof Error ? error.message : String(error)
  console.warn('[receiptApi] fallback to mock (DEV)', {
    endpoint: AI_API_ENDPOINTS.receiptAnalyze,
    status,
    reason,
  })
}

export async function analyzeReceiptImage(imageDataUrl: string): Promise<ReceiptAnalysisResult> {
  const trimmedImageDataUrl = imageDataUrl.trim()

  if (!trimmedImageDataUrl) {
    throw new Error('분석할 영수증 사진을 선택해주세요.')
  }

  if (trimmedImageDataUrl.length > RECEIPT_IMAGE_MAX_DATA_URL_LENGTH) {
    throw new Error('이미지가 너무 커요. 영수증을 조금 더 가까이 찍거나 낮은 해상도로 다시 시도해주세요.')
  }

  const payload: ReceiptAnalysisApiRequestBody = {
    imageDataUrl: trimmedImageDataUrl,
  }

  if (shouldUseMockAi()) {
    return createReceiptAnalyzeMockResult(trimmedImageDataUrl)
  }

  let responseStatus: number | null = null

  try {
    const response = await fetch(AI_API_ENDPOINTS.receiptAnalyze, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    responseStatus = response.status
    const contentType = response.headers.get('content-type') || ''
    const data = (contentType.includes('application/json')
      ? await response.json()
      : { error: await response.text() }) as ReceiptAnalysisApiSuccess & ApiErrorBody

    if (!response.ok) {
      throw createReceiptHttpError(response.status, data)
    }

    return normalizeReceiptResult(data.result)
  } catch (error) {
    if (shouldUseReceiptMockFallbackInDev(responseStatus)) {
      logReceiptDevFallback(responseStatus, error)
      return createReceiptAnalyzeMockResult(trimmedImageDataUrl)
    }

    throw error
  }
}

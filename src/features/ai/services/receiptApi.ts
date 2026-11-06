import type { ReceiptAnalysisResult } from '../types/ai.types'
import { createReceiptAnalyzeMockResult } from '../mocks/receiptAnalyze.mock'

export const RECEIPT_IMAGE_MAX_DATA_URL_LENGTH = 3_600_000

export async function analyzeReceiptImage(imageDataUrl: string): Promise<ReceiptAnalysisResult> {
  const trimmedImageDataUrl = imageDataUrl.trim()

  if (!trimmedImageDataUrl) {
    throw new Error('분석할 영수증 사진을 선택해주세요.')
  }

  if (trimmedImageDataUrl.length > RECEIPT_IMAGE_MAX_DATA_URL_LENGTH) {
    throw new Error('이미지가 너무 커요. 영수증을 조금 더 가까이 찍거나 낮은 해상도로 다시 시도해주세요.')
  }

  return createReceiptAnalyzeMockResult(trimmedImageDataUrl)
}

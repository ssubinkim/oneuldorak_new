import type { ReceiptAnalysisResult } from '../types/ai.types'

const RECEIPT_FALLBACK_TEXT = {
  summary: '영수증 내용을 확인했어요.',
  spending: '확인 어려움',
  saving: '묶음 할인보다 실제로 필요한 수량을 먼저 확인해 보세요.',
  lunchbox: '도시락 재료가 확인되면 바로 반찬/메뉴로 연결해 드릴게요.',
  tip: '집에 있는 재료부터 먼저 확인하고 부족한 품목만 구매해 보세요.',
}

function toTrimmedUniqueList(items: string[]) {
  const uniqueItems: string[] = []
  const seen = new Set<string>()

  items.forEach((item) => {
    const normalized = item.trim()
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    uniqueItems.push(normalized)
  })

  return uniqueItems
}

function formatWon(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '확인 어려움'
  }

  return `${new Intl.NumberFormat('ko-KR').format(Math.round(value))}원`
}

function readTopSpendingItems(result: ReceiptAnalysisResult) {
  const topItems = result.items
    .filter((item) => typeof item.price === 'number' && Number.isFinite(item.price))
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    .slice(0, 3)

  if (topItems.length === 0) {
    return RECEIPT_FALLBACK_TEXT.spending
  }

  return topItems
    .map((item) => `${item.name} (${formatWon(item.price)})`)
    .join(', ')
}

function readLunchboxIngredients(result: ReceiptAnalysisResult) {
  const explicitIngredients = toTrimmedUniqueList(result.lunchboxIngredients)
  if (explicitIngredients.length > 0) {
    return explicitIngredients
  }

  const inferredIngredients = toTrimmedUniqueList(
    result.items
      .filter((item) => item.lunchboxUsable)
      .map((item) => item.name),
  )

  return inferredIngredients
}

function readSavingTips(result: ReceiptAnalysisResult) {
  const tips = toTrimmedUniqueList(result.savingTips).slice(0, 3)
  if (tips.length > 0) {
    return tips.join(' / ')
  }
  return RECEIPT_FALLBACK_TEXT.saving
}

function readNextShoppingTip(result: ReceiptAnalysisResult) {
  const recommendedMenu = result.recommendedMenus[0]
  const menuTip = recommendedMenu?.name
    ? `${recommendedMenu.name}${recommendedMenu.reason ? `: ${recommendedMenu.reason}` : ''}`
    : ''
  const tipCandidates = toTrimmedUniqueList([
    result.nextAction,
    menuTip,
  ].filter((candidate): candidate is string => Boolean(candidate)))

  if (tipCandidates.length > 0) {
    return tipCandidates.join(' / ')
  }

  return RECEIPT_FALLBACK_TEXT.tip
}

export function buildReceiptAnalysisChatText(result: ReceiptAnalysisResult) {
  const summary = result.summary?.trim() || RECEIPT_FALLBACK_TEXT.summary
  const totalAmountLine = formatWon(result.totalAmount)
  const topSpendingLine = readTopSpendingItems(result)
  const lunchboxIngredients = readLunchboxIngredients(result)
  const lunchboxLine = lunchboxIngredients.length > 0
    ? lunchboxIngredients.join(', ')
    : RECEIPT_FALLBACK_TEXT.lunchbox
  const savingTipsLine = readSavingTips(result)
  const nextTipLine = readNextShoppingTip(result)

  return [
    `총평: ${summary}`,
    `총 지출: ${totalAmountLine}`,
    `지출이 큰 항목: ${topSpendingLine}`,
    `절약할 수 있는 항목: ${savingTipsLine}`,
    `도시락에 활용하기 좋은 재료: ${lunchboxLine}`,
    `다음 장보기 팁: ${nextTipLine}`,
  ].join('\n')
}

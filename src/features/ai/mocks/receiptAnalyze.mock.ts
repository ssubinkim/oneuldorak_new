import type { ReceiptAnalysisResult } from '../types/ai.types'

const RECEIPT_ANALYZE_MOCK_VARIANTS: ReceiptAnalysisResult[] = [
  {
    storeName: '오늘마트 강남점',
    purchasedAt: '2026-05-24 18:42',
    totalAmount: 26800,
    items: [
      { name: '계란 10구', price: 4800, quantity: '1판', category: 'dairy', lunchboxUsable: true },
      { name: '닭가슴살 600g', price: 7900, quantity: '1팩', category: 'meat', lunchboxUsable: true },
      { name: '브로콜리', price: 3200, quantity: '1개', category: 'vegetable', lunchboxUsable: true },
      { name: '파프리카', price: 2900, quantity: '2개', category: 'vegetable', lunchboxUsable: true },
      { name: '그릭요거트', price: 4300, quantity: '1개', category: 'dairy', lunchboxUsable: false },
      { name: '감자칩', price: 3700, quantity: '1봉', category: 'snack', lunchboxUsable: false },
    ],
    lunchboxIngredients: ['계란', '닭가슴살', '브로콜리', '파프리카'],
    savingTips: [
      '간식(감자칩) 비중이 커서 다음 장보기 때는 1개만 구매해도 충분해요.',
      '단백질/채소 재료는 활용도가 높아 도시락 준비 관점에서 효율이 좋아요.',
      '닭가슴살은 소분 냉동하면 폐기 없이 3~4회 도시락에 활용할 수 있어요.',
    ],
    recommendedMenus: [
      {
        name: '닭가슴살 브로콜리 볶음 도시락',
        reason: '단백질과 채소를 한 번에 챙기기 좋고 조리 시간이 짧아요.',
        ingredients: ['닭가슴살', '브로콜리', '파프리카', '간장'],
      },
      {
        name: '파프리카 계란말이 도시락',
        reason: '계란 소비가 빠르고 식어도 맛이 안정적이에요.',
        ingredients: ['계란', '파프리카', '소금'],
      },
    ],
    summary: '도시락용 핵심 재료를 잘 구매했지만 간식 지출은 조금 줄일 수 있어요.',
    nextAction: '닭가슴살과 채소를 오늘 저녁에 미리 손질해 도시락 2회분으로 소분해보세요.',
  },
  {
    storeName: '알뜰식자재 마트',
    purchasedAt: '2026-05-24 12:08',
    totalAmount: 19450,
    items: [
      { name: '두부', price: 1800, quantity: '2모', category: 'dairy', lunchboxUsable: true },
      { name: '양배추', price: 2900, quantity: '1/2통', category: 'vegetable', lunchboxUsable: true },
      { name: '참치캔', price: 4200, quantity: '2개', category: 'seafood', lunchboxUsable: true },
      { name: '김치', price: 3900, quantity: '1팩', category: 'vegetable', lunchboxUsable: true },
      { name: '탄산음료', price: 2650, quantity: '1병', category: 'drink', lunchboxUsable: false },
      { name: '쿠키', price: 4000, quantity: '1상자', category: 'snack', lunchboxUsable: false },
    ],
    lunchboxIngredients: ['두부', '양배추', '참치캔', '김치'],
    savingTips: [
      '음료/간식(탄산음료, 쿠키) 금액이 합계의 약 34%로 높아요.',
      '기본 반찬 재료(두부, 김치, 양배추)는 가성비가 좋아 반복 활용이 가능해요.',
      '참치캔은 1개씩만 사용하도록 나눠 쓰면 주간 예산 관리에 유리해요.',
    ],
    recommendedMenus: [
      {
        name: '참치김치 볶음밥 도시락',
        reason: '보유 재료만으로 빠르게 만들 수 있고 포만감이 좋아요.',
        ingredients: ['참치캔', '김치', '밥', '양배추'],
      },
      {
        name: '두부 양배추 덮밥',
        reason: '저비용으로 단백질과 채소를 함께 챙길 수 있어요.',
        ingredients: ['두부', '양배추', '간장', '참기름'],
      },
    ],
    summary: '도시락 활용 재료를 잘 담았고, 간식류만 줄이면 장보기 효율이 더 좋아져요.',
    nextAction: '이번 주는 쿠키/음료 재구매를 미루고, 남은 참치캔으로 1회 더 도시락을 만들어보세요.',
  },
]

function cloneReceiptAnalyzeMockResult(result: ReceiptAnalysisResult): ReceiptAnalysisResult {
  return {
    storeName: result.storeName,
    purchasedAt: result.purchasedAt,
    totalAmount: result.totalAmount,
    items: result.items.map((item) => ({ ...item })),
    lunchboxIngredients: [...result.lunchboxIngredients],
    savingTips: [...result.savingTips],
    recommendedMenus: result.recommendedMenus.map((menu) => ({
      ...menu,
      ingredients: [...menu.ingredients],
    })),
    summary: result.summary,
    nextAction: result.nextAction,
  }
}

export function createReceiptAnalyzeMockResult(imageDataUrl?: string): ReceiptAnalysisResult {
  const variantIndex = imageDataUrl
    ? imageDataUrl.length % RECEIPT_ANALYZE_MOCK_VARIANTS.length
    : 0

  return cloneReceiptAnalyzeMockResult(RECEIPT_ANALYZE_MOCK_VARIANTS[variantIndex] ?? RECEIPT_ANALYZE_MOCK_VARIANTS[0])
}

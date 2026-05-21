import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const PORT = Number(process.env.PORT) || 4242
const HOST = process.env.HOST || '127.0.0.1'
const AI_DEBUG_PREFIX = '[oneuldorak-ai-server]'

const ONEULDORAK_SYSTEM_PROMPT = `
너는 '오늘도락' 앱의 카메라 AI 도우미야.
사용자가 찍은 사진이나 입력한 내용을 바탕으로 
도시락, 장보기, 절약을 도와줘.

말투는 친절하고 귀엽게 하되, 과하게 길게 쓰지 마.
답변은 한국어로만 해.

반드시 지킬 규칙:
1) 사용자가 제공한 사진/텍스트 정보만 바탕으로 답해.
2) 확실하지 않은 내용은 지어내지 말고 "확실하지 않아요"라고 말해.
3) 정보가 부족하면 필요한 질문을 1~2개만 간단히 물어봐.
4) 음식 알레르기 유발 가능 재료가 보이면 조심하라고 안내해.
   예: 우유, 달걀, 땅콩, 견과류, 갑각류, 밀, 대두 등
5) 유통기한이 지났거나 상태가 이상해 보이는 식재료는 섭취를 권하지 마.
6) 답변은 짧고 보기 쉽게 작성해.

기능별 답변 규칙:

[1. 가진 재료로 메뉴 추천]
사용자가 냉장고 재료 사진이나 재료명을 제공하면 아래 형식으로 답해.

- 추천 메뉴:
- 활용 재료:
- 추가로 있으면 좋은 재료:
- 예상 조리 시간:
- 간단한 조리법:
- 절약 포인트:

각 항목은 1~2문장으로 짧게 작성해.

[2. 영수증 분석]
사용자가 영수증 사진이나 구매 내역을 제공하면 아래 형식으로 답해.

- 총평:
- 지출이 큰 항목:
- 절약할 수 있는 항목:
- 도시락에 활용하기 좋은 재료:
- 다음 장보기 팁:

영수증의 금액이나 품목이 흐릿해서 확실하지 않으면 추측하지 말고 안내해.

[3. 살까 말까 판단]
사용자가 도시락 관련 용품(예: 도시락통, 젓가락, 보냉백)이나 식재료 구매 고민을 입력하면 아래 형식으로 답해.

- 판단:
- 이유:
- 도시락 활용도:
- 가격/가성비 체크:
- 추천 행동:

판단은 "사도 좋아요", "보류해도 좋아요", "사지 않는 걸 추천해요" 중 하나로 말해.
반드시 오늘 도시락 준비 기준(활용도, 보관성, 가격 대비 효율)으로 판단해.
단, 가격이나 용량 정보가 없으면 가성비를 단정하지 마.

[기타]
도시락, 식재료, 장보기, 영수증, 절약과 관련 없는 질문이면
"오늘도락에서는 도시락과 장보기 절약을 도와드릴 수 있어요!"라고 짧게 안내해.
`

function looksLikeVisionFailure(text) {
  if (!text) return false
  return /사진.*볼 수 없|이미지.*볼 수 없|사진.*보이지 않|이미지.*보이지 않|재료.*알려주면/i.test(text)
}

function shouldLogAiDebug() {
  return process.env.NODE_ENV !== 'production' || process.env.AI_DEBUG === 'true'
}

function getMessagePreview(message) {
  return message.length > 80 ? `${message.slice(0, 80)}...` : message
}

function logAiDebug(label, details) {
  if (!shouldLogAiDebug()) return
  console.info(`${AI_DEBUG_PREFIX} ${label}`, details)
}

function normalizeAnalysisType(value) {
  if (value === 'menu' || value === 'receipt' || value === 'judge') {
    return value
  }
  return ''
}

const AI_FEATURES = [
  'today-lunchbox-recommendation',
  'weekly-lunchbox-plan',
  'ingredient-recipes',
  'today-recommended-ingredients',
  'leftover-ingredients',
  'buy-or-not',
  'fridge-photo-analysis',
  'receipt-analysis',
]

function normalizeFeature(value) {
  return AI_FEATURES.includes(value) ? value : ''
}

function inferAnalysisType(message, explicitType) {
  if (explicitType) return explicitType

  const normalized = (message || '').replace(/\s+/g, '')

  if (/(영수증|지출|결제|구매내역|구매목록|합계|금액|마트)/.test(normalized)) {
    return 'receipt'
  }

  if (/(살까말까|살까|사지말|보류|가성비|판단)/.test(normalized)) {
    return 'judge'
  }

  return 'menu'
}

function inferFeature(message, analysisType, imageDataUrl, explicitFeature) {
  if (explicitFeature) return explicitFeature

  const normalized = (message || '').replace(/\s+/g, '').toLowerCase()

  if (imageDataUrl && analysisType !== 'judge') {
    if (analysisType === 'receipt') {
      return 'receipt-analysis'
    }
    return 'fridge-photo-analysis'
  }

  if (analysisType === 'receipt') {
    return 'receipt-analysis'
  }

  if (analysisType === 'judge') {
    return 'buy-or-not'
  }

  if (/weekly|week|주간|일주일|이번주|플랜/.test(normalized)) {
    return 'weekly-lunchbox-plan'
  }

  if (/추천재료|오늘추천재료|재료추천/.test(normalized)) {
    return 'today-recommended-ingredients'
  }

  if (/leftover|남은재료|남은|자투리|활용/.test(normalized)) {
    return 'leftover-ingredients'
  }

  if (/ingredient|recipe|재료별|레시피/.test(normalized)) {
    return 'ingredient-recipes'
  }

  if (/fridge|냉장고|사진분석/.test(normalized)) {
    return 'fridge-photo-analysis'
  }

  return 'today-lunchbox-recommendation'
}

function getEffectiveAnalysisType(analysisType, feature) {
  if (feature === 'buy-or-not') return 'judge'
  if (feature === 'receipt-analysis') return 'receipt'
  if (feature === 'fridge-photo-analysis') return 'menu'
  return analysisType
}

function getMaxOutputTokens(feature) {
  if (feature === 'weekly-lunchbox-plan' || feature === 'fridge-photo-analysis') {
    return 520
  }

  return 420
}

function getAnalysisTypeInstruction(analysisType, feature, hasImage) {
  if (analysisType === 'receipt') {
    return `
[현재 분석 유형: 영수증 분석]
영수증(구매내역) 분석 형식으로만 답해.
- 총평:
- 지출이 큰 항목:
- 절약할 수 있는 항목:
- 도시락에 활용하기 좋은 재료:
- 다음 장보기 팁:
`
  }

  if (feature === 'buy-or-not' || analysisType === 'judge') {
    return `
[현재 기능: 살까 말까 판단]
살까 말까 판단 형식으로만 답해.
- 판단:
- 이유:
- 도시락 활용도:
- 가격/가성비 체크:
- 추천 행동:
`
  }

  if (feature === 'fridge-photo-analysis') {
    return `
[현재 기능: 냉장고 사진 분석]
${hasImage ? '첨부된 냉장고 사진에서 실제로 보이는 식재료만 분석해.' : '사진이 없으면 냉장고 사진을 올려 달라고 짧게 안내해.'}
아래 형식으로만 답해.
- 확인된 재료:
- 먼저 쓸 재료:
- 오늘 추천 메뉴:
- 간단한 조리법:
- 보관/주의:

사진에서 확실하지 않은 재료는 단정하지 말고 "확실하지 않아요"라고 말해.
`
  }

  if (feature === 'weekly-lunchbox-plan') {
    return `
[현재 기능: 주간 도시락 플랜]
월요일부터 금요일까지 도시락 흐름을 짜줘.
재료가 겹치도록 구성해서 장보기 부담을 줄여.
아래 형식으로만 답해.
- 이번 주 방향:
- 월:
- 화:
- 수:
- 목:
- 금:
- 장보기 핵심 재료:
- 절약 포인트:
`
  }

  if (feature === 'ingredient-recipes') {
    return `
[현재 기능: 재료별 레시피]
사용자가 말한 재료를 중심으로 만들 수 있는 도시락 레시피를 추천해.
재료가 불명확하면 먼저 필요한 재료를 1개만 물어봐.
아래 형식으로만 답해.
- 추천 레시피:
- 사용하는 재료:
- 추가하면 좋은 재료:
- 조리 시간:
- 만드는 법:
- 도시락 팁:
`
  }

  if (feature === 'today-recommended-ingredients') {
    return `
[현재 기능: 오늘 추천 재료]
오늘 사두면 도시락에 바로 활용하기 좋은 재료를 추천해.
가격, 보관성, 활용도를 같이 고려해.
아래 형식으로만 답해.
- 추천 재료:
- 추천 이유:
- 바로 만들 수 있는 메뉴:
- 보관 팁:
- 사지 않아도 되는 경우:
`
  }

  if (feature === 'leftover-ingredients') {
    return `
[현재 기능: 남은 재료 활용]
남은 재료를 버리지 않고 도시락으로 이어 쓰는 방법을 제안해.
먼저 써야 할 재료와 보관 가능한 재료를 구분해.
아래 형식으로만 답해.
- 먼저 쓸 재료:
- 추천 메뉴:
- 활용 방법:
- 추가하면 좋은 재료:
- 절약 포인트:
`
  }

  return `
[현재 기능: 오늘 도시락 추천]
오늘 먹기 좋은 도시락 메뉴 1개를 추천해.
준비 시간, 보유 재료 활용, 식어도 먹기 좋은지를 고려해.
아래 형식으로만 답해.
- 추천 메뉴:
- 활용 재료:
- 추가로 있으면 좋은 재료:
- 예상 조리 시간:
- 간단한 조리법:
- 절약 포인트:
`
}

function buildUserInput(message, imageDataUrl, analysisType, feature) {
  const userContent = []
  const modeInstruction = getAnalysisTypeInstruction(analysisType, feature, Boolean(imageDataUrl))

  if (imageDataUrl) {
    userContent.push({
      type: 'input_image',
      image_url: imageDataUrl,
      detail: 'high',
    })
    userContent.push({
      type: 'input_text',
      text: '중요: 위 이미지를 실제로 분석해서 답변해. 보이지 않는다고 단정하지 말고, 정말 식별이 어려운 경우에만 그렇게 말해.',
    })
  }

  userContent.push({
    type: 'input_text',
    text: modeInstruction,
  })

  if (message) {
    userContent.push({
      type: 'input_text',
      text: message,
    })
  }

  return [
    {
      role: 'user',
      content: userContent,
    },
  ]
}

async function requestMenuRecommendation(client, { message, imageDataUrl, analysisType, feature, model }) {
  return await client.responses.create({
    model,
    instructions: ONEULDORAK_SYSTEM_PROMPT,
    input: buildUserInput(message, imageDataUrl, analysisType, feature),
    max_output_tokens: getMaxOutputTokens(feature),
  })
}

const RECEIPT_IMAGE_MAX_DATA_URL_LENGTH = 5_000_000
const RECEIPT_ANALYSIS_MODEL = process.env.OPENAI_RECEIPT_MODEL?.trim() || 'gpt-4o-mini'

const RECEIPT_ANALYSIS_PROMPT = `
너는 오늘도락 앱의 영수증 분석 AI야.
사용자가 업로드한 영수증 이미지를 읽고 도시락 준비와 장보기 절약에 도움이 되도록 분석해.

반드시 JSON 객체만 반환해. 마크다운 코드블록, 설명 문장, 주석은 절대 넣지 마.
영수증에서 읽히지 않는 항목은 "확인 어려움"으로 처리해.
금액을 정확히 읽을 수 없으면 추측하지 말고 null로 반환하거나 필드를 생략해.
품목명, 수량, 가격도 영수증에서 확인 가능한 정보만 사용해.
도시락 활용 여부는 식재료와 식사 준비에 쓸 수 있는지 기준으로 판단해.
간식, 음료, 생필품처럼 도시락 재료로 보기 어려운 항목은 lunchboxUsable을 false로 둬.

반환 형식:
{
  "storeName": "가게명 또는 확인 어려움",
  "purchasedAt": "구매일시 또는 확인 어려움",
  "totalAmount": 12300,
  "items": [
    {
      "name": "품목명",
      "price": 3000,
      "quantity": "1개",
      "category": "vegetable",
      "lunchboxUsable": true
    }
  ],
  "lunchboxIngredients": ["도시락에 쓸 수 있는 재료명"],
  "savingTips": ["과소비/절약 포인트"],
  "recommendedMenus": [
    {
      "name": "추천 도시락 메뉴",
      "reason": "추천 이유",
      "ingredients": ["필요 재료"]
    }
  ],
  "summary": "전체 요약",
  "nextAction": "다음 행동 제안"
}
`

const RECEIPT_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    storeName: { type: ['string', 'null'] },
    purchasedAt: { type: ['string', 'null'] },
    totalAmount: { type: ['number', 'null'] },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          price: { type: ['number', 'null'] },
          quantity: { type: ['string', 'null'] },
          category: {
            type: ['string', 'null'],
            enum: ['vegetable', 'meat', 'seafood', 'dairy', 'grain', 'snack', 'drink', 'etc', null],
          },
          lunchboxUsable: { type: ['boolean', 'null'] },
        },
        required: ['name'],
      },
    },
    lunchboxIngredients: {
      type: 'array',
      items: { type: 'string' },
    },
    savingTips: {
      type: 'array',
      items: { type: 'string' },
    },
    recommendedMenus: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          reason: { type: 'string' },
          ingredients: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['name', 'reason', 'ingredients'],
      },
    },
    summary: { type: 'string' },
    nextAction: { type: 'string' },
  },
  required: ['items', 'lunchboxIngredients', 'savingTips', 'recommendedMenus', 'summary', 'nextAction'],
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readReceiptString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readReceiptNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readReceiptBoolean(value) {
  return typeof value === 'boolean' ? value : undefined
}

function readReceiptStringArray(value) {
  return Array.isArray(value)
    ? value.map(readReceiptString).filter(Boolean)
    : []
}

function extractJsonObjectText(text) {
  const trimmed = text.trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')

  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1)
  }

  return trimmed
}

function normalizeReceiptAnalysisResult(value) {
  if (!isPlainObject(value)) {
    throw new Error('영수증 분석 결과 형식이 올바르지 않습니다.')
  }

  const items = Array.isArray(value.items)
    ? value.items
      .filter(isPlainObject)
      .map((item) => ({
        name: readReceiptString(item.name) || '확인 어려움',
        price: readReceiptNumber(item.price),
        quantity: readReceiptString(item.quantity),
        category: readReceiptString(item.category) || 'etc',
        lunchboxUsable: readReceiptBoolean(item.lunchboxUsable) ?? false,
      }))
    : []

  return {
    storeName: readReceiptString(value.storeName),
    purchasedAt: readReceiptString(value.purchasedAt),
    totalAmount: readReceiptNumber(value.totalAmount),
    items: items.length > 0
      ? items
      : [{ name: '확인 어려움', category: 'etc', lunchboxUsable: false }],
    lunchboxIngredients: readReceiptStringArray(value.lunchboxIngredients),
    savingTips: readReceiptStringArray(value.savingTips),
    recommendedMenus: Array.isArray(value.recommendedMenus)
      ? value.recommendedMenus
        .filter(isPlainObject)
        .map((menu) => ({
          name: readReceiptString(menu.name) || '추천 메뉴 확인 어려움',
          reason: readReceiptString(menu.reason) || '영수증 정보가 부족해 이유를 확인하기 어려워요.',
          ingredients: readReceiptStringArray(menu.ingredients),
        }))
      : [],
    summary: readReceiptString(value.summary) || '영수증 내용을 확인했어요.',
    nextAction: readReceiptString(value.nextAction) || '도시락에 쓸 재료를 골라 보관 목록에 추가해보세요.',
  }
}

function parseReceiptAnalysisText(text) {
  const jsonText = extractJsonObjectText(text)
  const parsed = JSON.parse(jsonText)
  return normalizeReceiptAnalysisResult(parsed)
}

function isVisionModelError(error) {
  const message = error instanceof Error ? error.message : String(error)
  return /image|vision|input_image|unsupported|modalit/i.test(message)
}

async function requestReceiptAnalysis(client, imageDataUrl) {
  const response = await client.responses.create({
    model: RECEIPT_ANALYSIS_MODEL,
    instructions: RECEIPT_ANALYSIS_PROMPT,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_image',
            image_url: imageDataUrl,
            detail: 'high',
          },
          {
            type: 'input_text',
            text: '이 영수증 이미지를 분석해서 오늘도락 도시락 준비용 JSON만 반환해줘.',
          },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'receipt_analysis_result',
        schema: RECEIPT_ANALYSIS_JSON_SCHEMA,
        strict: false,
      },
    },
    max_output_tokens: 1200,
  })

  const text = response.output_text?.trim() || ''
  if (!text) {
    throw new Error('영수증 분석 결과가 비어 있습니다.')
  }

  return parseReceiptAnalysisText(text)
}

app.use(cors())
app.use(express.json({ limit: '12mb' }))

let cachedClient = null

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    return null
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey })
  }

  return cachedClient
}

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'oneuldorak-ai-server is running',
    endpoints: {
      health: 'GET /health',
      chat: 'POST /api/chat',
      receiptAnalyze: 'POST /api/receipt/analyze',
    },
  })
})

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'oneuldorak-ai-server' })
})

app.post('/api/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  const imageDataUrl = typeof req.body?.imageDataUrl === 'string' ? req.body.imageDataUrl.trim() : ''
  const analysisTypeRaw = typeof req.body?.analysisType === 'string' ? req.body.analysisType.trim() : ''
  const featureRaw = typeof req.body?.feature === 'string' ? req.body.feature.trim() : ''
  const requestedAnalysisType = inferAnalysisType(message, normalizeAnalysisType(analysisTypeRaw))
  const feature = inferFeature(message, requestedAnalysisType, imageDataUrl, normalizeFeature(featureRaw))
  const analysisType = getEffectiveAnalysisType(requestedAnalysisType, feature)

  logAiDebug('request received', {
    source: 'api',
    feature,
    analysisType,
    requestedAnalysisType,
    explicitFeature: featureRaw || null,
    hasImage: Boolean(imageDataUrl),
    messagePreview: getMessagePreview(message),
  })

  if (!message && !imageDataUrl) {
    res.status(400).json({
      error: '메시지(message) 또는 이미지(imageDataUrl)를 입력해 주세요.',
    })
    return
  }

  if (imageDataUrl && !imageDataUrl.startsWith('data:image/')) {
    res.status(400).json({
      error: 'imageDataUrl 형식이 올바르지 않습니다. data:image/... 형식으로 보내주세요.',
    })
    return
  }

  const client = getOpenAiClient()

  if (!client) {
    logAiDebug('request rejected', {
      source: 'api',
      feature,
      analysisType,
      hasImage: Boolean(imageDataUrl),
      reason: 'OPENAI_API_KEY missing',
    })
    res.status(503).json({
      error:
        'OpenAI API 키가 설정되지 않았습니다. server/.env 파일을 만들고 OPENAI_API_KEY 값을 넣어주세요.',
    })
    return
  }

  try {
    const primaryModel = 'gpt-4o-mini'
    let model = primaryModel

    let response = await requestMenuRecommendation(client, {
      message,
      imageDataUrl,
      analysisType,
      feature,
      model: primaryModel,
    })

    let text = response.output_text?.trim() || '추천 결과를 만들지 못했어요. 다시 시도해 주세요.'

    if (imageDataUrl && looksLikeVisionFailure(text)) {
      logAiDebug('vision retry', {
        source: 'api',
        feature,
        analysisType,
        hasImage: true,
        fromModel: primaryModel,
        toModel: 'gpt-4.1-mini',
      })
      model = 'gpt-4.1-mini'
      response = await requestMenuRecommendation(client, {
        message,
        imageDataUrl,
        analysisType,
        feature,
        model: 'gpt-4.1-mini',
      })
      text = response.output_text?.trim() || text
    }

    logAiDebug('response sent', {
      source: 'api',
      feature,
      analysisType,
      hasImage: Boolean(imageDataUrl),
      model,
    })

    res.json({ text, feature, analysisType })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

    logAiDebug('request failed', {
      source: 'api',
      feature,
      analysisType,
      hasImage: Boolean(imageDataUrl),
      reason: messageText,
    })

    res.status(500).json({
      error: `GPT 응답 생성에 실패했어요: ${messageText}`,
    })
  }
})

app.post('/api/receipt/analyze', async (req, res) => {
  const imageDataUrl = typeof req.body?.imageDataUrl === 'string' ? req.body.imageDataUrl.trim() : ''

  logAiDebug('receipt request received', {
    source: 'api',
    feature: 'receipt-analysis',
    hasImage: Boolean(imageDataUrl),
    imageLength: imageDataUrl.length,
  })

  if (!imageDataUrl) {
    res.status(400).json({
      error: '분석할 영수증 이미지(imageDataUrl)를 보내주세요.',
    })
    return
  }

  if (!imageDataUrl.startsWith('data:image/')) {
    res.status(400).json({
      error: 'imageDataUrl 형식이 올바르지 않습니다. data:image/... 형식으로 보내주세요.',
    })
    return
  }

  if (imageDataUrl.length > RECEIPT_IMAGE_MAX_DATA_URL_LENGTH) {
    res.status(413).json({
      error: '이미지가 너무 커요. 영수증을 조금 더 가까이 찍거나 낮은 해상도로 다시 시도해주세요.',
    })
    return
  }

  const client = getOpenAiClient()

  if (!client) {
    res.status(503).json({
      error: 'OpenAI API 키가 설정되지 않았습니다. server/.env에 OPENAI_API_KEY를 넣어주세요.',
    })
    return
  }

  try {
    const result = await requestReceiptAnalysis(client, imageDataUrl)

    logAiDebug('receipt response sent', {
      source: 'api',
      feature: 'receipt-analysis',
      model: RECEIPT_ANALYSIS_MODEL,
      itemCount: result.items.length,
    })

    res.json({ result })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

    logAiDebug('receipt request failed', {
      source: 'api',
      feature: 'receipt-analysis',
      model: RECEIPT_ANALYSIS_MODEL,
      reason: messageText,
    })

    if (isVisionModelError(error)) {
      res.status(400).json({
        error: '현재 설정된 이미지 분석 모델이 영수증 사진을 읽지 못했어요. 이미지 입력을 지원하는 모델로 설정한 뒤 다시 시도해주세요.',
      })
      return
    }

    res.status(500).json({
      error: `영수증 분석에 실패했어요. 영수증을 더 밝게 찍어 다시 시도해주세요. (${messageText})`,
    })
  }
})

app.listen(PORT, HOST, () => {
  console.log(`oneuldorak-ai-server running on http://${HOST}:${PORT}`)
})

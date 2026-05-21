import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
const RECEIPT_IMAGE_MAX_DATA_URL_LENGTH = 5_000_000
const RECEIPT_ANALYSIS_MODEL = process.env.OPENAI_RECEIPT_MODEL?.trim() || 'gpt-4o-mini'

type JsonRecord = Record<string, unknown>
type ReceiptCategory = 'vegetable' | 'meat' | 'seafood' | 'dairy' | 'grain' | 'snack' | 'drink' | 'etc'

type ReceiptAnalysisResult = {
  storeName?: string
  purchasedAt?: string
  totalAmount?: number
  items: {
    name: string
    price?: number
    quantity?: string
    category?: ReceiptCategory
    lunchboxUsable?: boolean
  }[]
  lunchboxIngredients: string[]
  savingTips: string[]
  recommendedMenus: {
    name: string
    reason: string
    ingredients: string[]
  }[]
  summary: string
  nextAction: string
}

type OpenAIResponseData = JsonRecord & {
  output_text?: string
  output?: unknown
  error?: {
    message?: string
  }
}

const RECEIPT_ANALYSIS_PROMPT = `
너는 오늘도락 앱의 영수증 분석 AI야.
사용자가 업로드한 영수증 이미지를 읽고 도시락 준비와 장보기 절약에 도움이 되도록 분석해.

반드시 JSON 객체만 반환해. 마크다운 코드블록, 설명 문장, 주석은 절대 넣지 마.
영수증에서 읽히지 않는 항목은 "확인 어려움"으로 처리해.
금액을 정확히 읽을 수 없으면 추측하지 말고 null로 반환하거나 필드를 생략해.
품목명, 수량, 가격도 영수증에서 확인 가능한 정보만 사용해.
도시락 활용 여부는 식재료와 식사 준비에 쓸 수 있는지 기준으로 판단해.
간식, 음료, 생필품처럼 도시락 재료로 보기 어려운 항목은 lunchboxUsable을 false로 둬.
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

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
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

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map(readString).filter((item): item is string => Boolean(item))
    : []
}

function readCategory(value: unknown): ReceiptCategory | undefined {
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

function extractTextFromOpenAiResponse(data: OpenAIResponseData) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const output = data.output
  if (!Array.isArray(output)) return ''

  const texts: string[] = []

  for (const item of output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue

    for (const block of item.content) {
      if (!isRecord(block)) continue
      const text = block.text
      if (typeof text === 'string' && text.trim()) {
        texts.push(text.trim())
      }
    }
  }

  return texts.join('\n').trim()
}

function extractJsonObjectText(text: string) {
  const trimmed = text.trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  return start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed
}

function normalizeReceiptAnalysisResult(value: unknown): ReceiptAnalysisResult {
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
        category: readCategory(item.category) ?? 'etc',
        lunchboxUsable: readBoolean(item.lunchboxUsable) ?? false,
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
    items: items.length > 0
      ? items
      : [{ name: '확인 어려움', category: 'etc', lunchboxUsable: false }],
    lunchboxIngredients: readStringArray(value.lunchboxIngredients),
    savingTips: readStringArray(value.savingTips),
    recommendedMenus,
    summary: readString(value.summary) ?? '영수증 내용을 확인했어요.',
    nextAction: readString(value.nextAction) ?? '도시락에 쓸 재료를 골라 보관 목록에 추가해보세요.',
  }
}

function parseReceiptAnalysisText(text: string) {
  return normalizeReceiptAnalysisResult(JSON.parse(extractJsonObjectText(text)))
}

function readImageDataUrlFromBody(body: unknown) {
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as JsonRecord
      return typeof parsed.imageDataUrl === 'string' ? parsed.imageDataUrl.trim() : ''
    } catch {
      return ''
    }
  }

  if (isRecord(body)) {
    return typeof body.imageDataUrl === 'string' ? body.imageDataUrl.trim() : ''
  }

  return ''
}

async function readRawBodyIfNeeded(req: VercelRequest) {
  if (req.body !== undefined && req.body !== null) {
    return req.body
  }

  return await new Promise<string>((resolve, reject) => {
    let raw = ''

    req.on('data', (chunk: Buffer | string) => {
      raw += chunk.toString()
    })

    req.on('end', () => resolve(raw))
    req.on('error', reject)
  })
}

function buildOpenAiRequestBody(imageDataUrl: string) {
  return {
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
  }
}

function isVisionModelError(message: string) {
  return /image|vision|input_image|unsupported|modalit/i.test(message)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'POST 요청만 가능합니다.' })
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY가 설정되지 않았습니다. Vercel 프로젝트 환경변수에 추가해주세요.',
    })
  }

  const rawBody = await readRawBodyIfNeeded(req)
  const imageDataUrl = readImageDataUrlFromBody(rawBody)

  if (!imageDataUrl) {
    return res.status(400).json({ error: '분석할 영수증 이미지(imageDataUrl)를 보내주세요.' })
  }

  if (!imageDataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'imageDataUrl 형식이 올바르지 않습니다.' })
  }

  if (imageDataUrl.length > RECEIPT_IMAGE_MAX_DATA_URL_LENGTH) {
    return res.status(413).json({
      error: '이미지가 너무 커요. 영수증을 조금 더 가까이 찍거나 낮은 해상도로 다시 시도해주세요.',
    })
  }

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildOpenAiRequestBody(imageDataUrl)),
    })

    const data = (await openaiResponse.json()) as OpenAIResponseData

    if (!openaiResponse.ok) {
      const openaiErrorMessage = data.error?.message || 'OpenAI API 요청에 실패했습니다.'

      if (isVisionModelError(openaiErrorMessage)) {
        return res.status(400).json({
          error: '현재 설정된 이미지 분석 모델이 영수증 사진을 읽지 못했어요. 이미지 입력을 지원하는 모델로 설정한 뒤 다시 시도해주세요.',
        })
      }

      return res.status(openaiResponse.status).json({ error: openaiErrorMessage })
    }

    const text = extractTextFromOpenAiResponse(data)
    if (!text) {
      return res.status(500).json({ error: '영수증 분석 결과가 비어 있습니다.' })
    }

    return res.status(200).json({ result: parseReceiptAnalysisText(text) })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

    return res.status(500).json({
      error: `영수증 분석에 실패했어요. 영수증을 더 밝게 찍어 다시 시도해주세요. (${message})`,
    })
  }
}

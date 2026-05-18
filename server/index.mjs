import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const PORT = Number(process.env.PORT) || 4242
const HOST = process.env.HOST || '127.0.0.1'

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
사용자가 상품 사진이나 구매 고민을 입력하면 아래 형식으로 답해.

- 판단:
- 이유:
- 도시락 활용도:
- 가격/가성비 체크:
- 추천 행동:

판단은 "사도 좋아요", "보류해도 좋아요", "사지 않는 걸 추천해요" 중 하나로 말해.
단, 가격이나 용량 정보가 없으면 가성비를 단정하지 마.

[기타]
도시락, 식재료, 장보기, 영수증, 절약과 관련 없는 질문이면
"오늘도락에서는 도시락과 장보기 절약을 도와드릴 수 있어요!"라고 짧게 안내해.
`

function looksLikeVisionFailure(text) {
  if (!text) return false
  return /사진.*볼 수 없|이미지.*볼 수 없|사진.*보이지 않|이미지.*보이지 않|재료.*알려주면/i.test(text)
}

function buildUserInput(message, imageDataUrl) {
  const userContent = []

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

async function requestMenuRecommendation(client, { message, imageDataUrl, model }) {
  return await client.responses.create({
    model,
    instructions: ONEULDORAK_SYSTEM_PROMPT,
    input: buildUserInput(message, imageDataUrl),
    max_output_tokens: 360,
  })
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
    },
  })
})

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'oneuldorak-ai-server' })
})

app.post('/api/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  const imageDataUrl = typeof req.body?.imageDataUrl === 'string' ? req.body.imageDataUrl.trim() : ''

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
    res.status(503).json({
      error:
        'OpenAI API 키가 설정되지 않았습니다. server/.env 파일을 만들고 OPENAI_API_KEY 값을 넣어주세요.',
    })
    return
  }

  try {
    const primaryModel = 'gpt-4o-mini'

    let response = await requestMenuRecommendation(client, {
      message,
      imageDataUrl,
      model: primaryModel,
    })

    let text = response.output_text?.trim() || '추천 결과를 만들지 못했어요. 다시 시도해 주세요.'

    if (imageDataUrl && looksLikeVisionFailure(text)) {
      response = await requestMenuRecommendation(client, {
        message,
        imageDataUrl,
        model: 'gpt-4.1-mini',
      })
      text = response.output_text?.trim() || text
    }

    res.json({ text })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

    res.status(500).json({
      error: `GPT 응답 생성에 실패했어요: ${messageText}`,
    })
  }
})

app.listen(PORT, HOST, () => {
  console.log(`oneuldorak-ai-server running on http://${HOST}:${PORT}`)
})

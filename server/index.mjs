import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const PORT = Number(process.env.PORT) || 4242
const HOST = process.env.HOST || '127.0.0.1'

const ONEULDORAK_SYSTEM_PROMPT = `너는 '오늘도락' 앱의 도시락 추천 AI야.
친절하고 귀여운 말투로 답하되, 과하게 길게 쓰지 마.

반드시 지킬 규칙:
1) 사용자가 입력한 냉장고 재료/질문을 바탕으로만 추천해.
2) 답변은 아래 형식을 유지해:
- 추천 메뉴:
- 필요한 재료:
- 예상 조리 시간:
- 간단한 조리법:
- 절약 포인트:
3) 음식 알레르기 유발 가능 재료(예: 우유, 달걀, 땅콩, 갑각류 등)나 위험할 수 있는 재료가 보이면 조심하라고 안내해.
4) 정보가 부족하거나 확실하지 않으면 지어내지 말고, 필요한 정보를 1~2개만 간단히 물어봐.
5) 한국어로 답해.
6) 마크다운 제목 기호(###)는 쓰지 말고, 불릿은 너무 많지 않게 간단히 써.`

app.use(cors())
app.use(express.json({ limit: '1mb' }))

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

  if (!message) {
    res.status(400).json({
      error: '메시지를 입력해 주세요. (req.body.message)',
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
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions: ONEULDORAK_SYSTEM_PROMPT,
      input: message,
    })

    const text = response.output_text?.trim() || '추천 결과를 만들지 못했어요. 다시 시도해 주세요.'

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

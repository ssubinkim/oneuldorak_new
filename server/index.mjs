import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const PORT = Number(process.env.PORT) || 4242

const ONEULDORAK_SYSTEM_PROMPT = `너는 '오늘도락' 앱의 도시락 추천 AI야.
사용자가 입력한 냉장고 재료나 질문을 바탕으로
간단하고 실용적인 도시락 메뉴를 추천해줘.
답변은 너무 길지 않게,
추천 메뉴, 필요한 재료, 예상 조리 시간, 간단한 조리법, 절약 포인트 형식으로 정리해줘.`

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

app.listen(PORT, () => {
  console.log(`oneuldorak-ai-server running on http://localhost:${PORT}`)
})

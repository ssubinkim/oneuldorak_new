const CHAT_API_URL = '/api/chat'

type ChatApiSuccess = {
  text: string
}

type ChatApiError = {
  error?: string
}

export type AnalysisType = 'menu' | 'receipt' | 'judge'

type AskGptOptions = {
  imageDataUrl?: string
  analysisType?: AnalysisType
}

export async function askGPT(message: string, options?: AskGptOptions) {
  const trimmedMessage = message.trim()
  const imageDataUrl = options?.imageDataUrl?.trim()
  const analysisType = options?.analysisType

  if (!trimmedMessage && !imageDataUrl) {
    throw new Error('질문 또는 이미지를 입력해 주세요.')
  }

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: trimmedMessage,
      imageDataUrl,
      analysisType,
    }),
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = (isJson
    ? await response.json()
    : { error: await response.text() }) as ChatApiSuccess & ChatApiError

  if (!response.ok) {
    if (response.status === 502) {
      throw new Error('API 서버에 연결하지 못했어요. `cd server && npm run dev`로 백엔드를 먼저 실행해 주세요.')
    }
    if (response.status === 404) {
      throw new Error('API 경로를 찾지 못했어요. 로컬에서는 server를 먼저 실행해 주세요. (`cd server && npm run dev`)')
    }
    if (response.status === 413) {
      throw new Error('이미지 크기가 너무 커요. 조금 작은 사진으로 다시 시도해 주세요.')
    }
    throw new Error(data.error || `GPT 요청 중 문제가 발생했어요. (status: ${response.status})`)
  }

  return data.text || ''
}

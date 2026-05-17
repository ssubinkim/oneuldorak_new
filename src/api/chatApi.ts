const CHAT_API_URL = '/api/chat'

type ChatApiSuccess = {
  text: string
}

type ChatApiError = {
  error?: string
}

export async function askGPT(message: string) {
  const trimmedMessage = message.trim()

  if (!trimmedMessage) {
    throw new Error('질문을 입력해 주세요.')
  }

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: trimmedMessage }),
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = (isJson
    ? await response.json()
    : { error: await response.text() }) as ChatApiSuccess & ChatApiError

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('API 경로를 찾지 못했어요. 로컬에서는 server를 먼저 실행해 주세요. (`cd server && npm run dev`)')
    }
    throw new Error(data.error || `GPT 요청 중 문제가 발생했어요. (status: ${response.status})`)
  }

  return data.text || ''
}

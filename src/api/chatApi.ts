const DEFAULT_CHAT_API_BASE_URL = 'http://localhost:4242'
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL?.trim() || DEFAULT_CHAT_API_BASE_URL
const CHAT_API_URL = `${CHAT_API_BASE_URL.replace(/\/$/, '')}/api/chat`

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

  const data = (await response.json()) as ChatApiSuccess & ChatApiError

  if (!response.ok) {
    throw new Error(data.error || 'GPT 요청 중 문제가 발생했어요.')
  }

  return data.text || ''
}

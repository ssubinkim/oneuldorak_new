import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage, RecipeData } from '../../types/chatbot'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import { askGPT } from '../../api/chatApi'
import chatbotMascotIcon from '../../components/chatbot/images/chatbot .svg'
import btnXIcon from '../../components/chatbot/images/btn_x.svg'
import defaultRecipeCardImage from '../../components/chatbot/images/tunamayo.svg'
import chamchimayoImage from '../../assets/images/food_imges/chamchimayo.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import kimbokImage from '../../assets/images/food_imges/kimbok.png'
import omuriceImage from '../../assets/images/food_imges/omurice.png'
import bulgogiImage from '../../assets/images/food_imges/bulgogi.png'
import ssoyaImage from '../../assets/images/food_imges/ssoya.png'
import sandwichFoodImage from '../../assets/images/food_imges/food_3.png'
import panFoodImage from '../../assets/images/food_imges/food_2.png'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import ChatbotRecipeCard from '../../components/chatbot/ChatbotRecipeCard'
import '../chatbot/Chatbot.css'
import './ChatbotChat.css'

type AiLoadingMessage = { id: string; type: 'ai-loading' }
type LocalMessage = ChatMessage | AiLoadingMessage
type CameraAnalysisResult = { userText: string; aiText: string }

const CAMERA_ANALYSIS_STORAGE_KEY = 'oneuldorak:chatbot-camera-analysis:v1'

function getInitialQuery() {
  const hash = window.location.hash
  const qIndex = hash.indexOf('?q=')
  if (qIndex === -1) return ''
  return decodeURIComponent(hash.slice(qIndex + 3))
}

function readCameraAnalysisResult() {
  if (typeof window === 'undefined') return null

  const rawValue = window.sessionStorage.getItem(CAMERA_ANALYSIS_STORAGE_KEY)
  if (!rawValue) return null

  window.sessionStorage.removeItem(CAMERA_ANALYSIS_STORAGE_KEY)

  try {
    const parsed = JSON.parse(rawValue) as Partial<CameraAnalysisResult>
    if (typeof parsed.userText !== 'string' || typeof parsed.aiText !== 'string') {
      return null
    }
    return {
      userText: parsed.userText.trim(),
      aiText: parsed.aiText.trim(),
    }
  } catch {
    return null
  }
}

const FOLLOW_UP_SUGGESTIONS = ['좋아. 레시피 볼래.', '더 가벼운 메뉴 추천해줘.', '더 든든한 메뉴로 추천해줘', '다른 메뉴 보여줘.']

function createSuggestionsMessage(): ChatMessage {
  return {
    id: `ai-suggestions-${Date.now()}`,
    type: 'suggestions',
    items: FOLLOW_UP_SUGGESTIONS,
  }
}

const RECIPE_SECTION_LABELS = {
  menu: ['추천 메뉴', '추천메뉴'],
  ingredients: ['필요한 재료', '필요 재료', '재료'],
  time: ['예상 조리 시간', '예상조리시간', '조리 시간', '조리시간'],
  cost: ['예상 식비', '예상식비', '예상 비용', '예상비용', '비용'],
  method: ['간단한 조리법', '조리법'],
  saving: ['절약 포인트', '절약포인트', '추천 이유', '이유'],
} as const

type RecipeSectionKey = keyof typeof RECIPE_SECTION_LABELS

const RECIPE_IMAGE_RULES: Array<{ keywords: string[]; image: string }> = [
  { keywords: ['참치', '마요', '주먹밥', '김밥'], image: chamchimayoImage },
  { keywords: ['비빔밥', '채소덮밥'], image: bibimbapImage },
  { keywords: ['김치볶음밥', '볶음밥'], image: kimbokImage },
  { keywords: ['오무라이스', '계란밥'], image: omuriceImage },
  { keywords: ['불고기', '고기덮밥', '제육'], image: bulgogiImage },
  { keywords: ['소야', '소시지', '브리또', '도시락'], image: ssoyaImage },
  { keywords: ['샌드위치', '토스트'], image: sandwichFoodImage },
  { keywords: ['파스타', '면', '국수'], image: panFoodImage },
]

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeSectionLine(line: string) {
  return line
    .trim()
    .replace(/^[-•]\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .trim()
}

function findSectionKey(line: string) {
  for (const [key, labels] of Object.entries(RECIPE_SECTION_LABELS) as [RecipeSectionKey, readonly string[]][]) {
    for (const label of labels) {
      const match = line.match(new RegExp(`^${escapeRegExp(label)}\\s*[:：]?\\s*(.*)$`))
      if (match) {
        return { key, value: match[1]?.trim() ?? '' }
      }
    }
  }
  return null
}

function joinSection(lines: string[]) {
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function buildRecipeSubtitle(ingredients: string, cookTime: string) {
  const compactIngredients = ingredients
    .replace(/\n/g, ', ')
    .replace(/[•-]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const ingredientPreview = compactIngredients
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(', ')

  if (ingredientPreview) {
    const subtitle = `${ingredientPreview} 활용`
    return subtitle.length > 26 ? `${subtitle.slice(0, 25).trimEnd()}...` : subtitle
  }

  if (cookTime) {
    return `${cookTime} 안에 완성`
  }

  return '간단한 한 끼 · 재료 활용'
}

function normalizeCost(cost: string) {
  const trimmed = cost.trim()
  if (!trimmed) return '약 2,500원'

  if (/원/.test(trimmed)) {
    return trimmed
  }

  if (/^\d[\d,]*$/.test(trimmed)) {
    return `${trimmed}원`
  }

  return trimmed
}

function pickRecipeImage(title: string, ingredients: string) {
  const base = `${title} ${ingredients}`.toLowerCase()
  const matchedRule = RECIPE_IMAGE_RULES.find((rule) =>
    rule.keywords.some((keyword) => base.includes(keyword.toLowerCase())),
  )
  return matchedRule?.image || defaultRecipeCardImage
}

function parseRecipeFromAiText(text: string): RecipeData | null {
  const sections: Record<RecipeSectionKey, string[]> = {
    menu: [],
    ingredients: [],
    time: [],
    cost: [],
    method: [],
    saving: [],
  }

  let currentKey: RecipeSectionKey | null = null
  const lines = text.replace(/\r\n/g, '\n').split('\n')

  for (const rawLine of lines) {
    const line = normalizeSectionLine(rawLine)

    if (!line) {
      if (currentKey && sections[currentKey].length > 0) {
        sections[currentKey].push('')
      }
      continue
    }

    const matchedSection = findSectionKey(line)
    if (matchedSection) {
      currentKey = matchedSection.key
      if (matchedSection.value) {
        sections[currentKey].push(matchedSection.value)
      }
      continue
    }

    if (currentKey) {
      sections[currentKey].push(line)
    }
  }

  const menuRaw = joinSection(sections.menu)
  const menuTitle = menuRaw.split('\n')[0]?.trim() ?? ''

  if (!menuTitle) {
    return null
  }

  const ingredients = joinSection(sections.ingredients)
  const cookTime = joinSection(sections.time) || '15분'
  const estimatedCost = normalizeCost(joinSection(sections.cost))
  const method = joinSection(sections.method)
  const saving = joinSection(sections.saving)

  let reason = saving
  if (!reason && ingredients) {
    const compactIngredients = ingredients
      .replace(/\n/g, ', ')
      .replace(/[•-]\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    reason = `보유 재료인 ${compactIngredients}를 활용할 수 있어요.`
  }
  if (!reason && method) {
    reason = method.split('\n')[0]?.trim() ?? ''
  }
  if (!reason) {
    reason = '지금 있는 재료를 활용해서 간단하게 만들기 좋아요.'
  }

  if (reason.length > 110) {
    reason = `${reason.slice(0, 107).trimEnd()}...`
  }

  return {
    title: menuTitle,
    subtitle: buildRecipeSubtitle(ingredients, cookTime),
    imageUrl: pickRecipeImage(menuTitle, ingredients),
    cookTime,
    estimatedCost,
    reason,
  }
}

function normalizeAiText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function renderBubbleText(text: string) {
  const normalizedText = normalizeAiText(text)
  return normalizedText.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  )
}

function createAiMessage(id: string, text: string): ChatMessage {
  const recipe = parseRecipeFromAiText(text)
  if (recipe) {
    return {
      id,
      type: 'ai-recipe',
      recipe,
    }
  }

  return {
    id,
    type: 'ai-text',
    text: text.trim() || '추천 결과를 만들지 못했어요. 다시 시도해 주세요.',
  }
}

function ChatbotChat() {
  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도시락러버'
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const messagesRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  const requestAiResponse = useCallback(async (userText: string, pendingId: string) => {
    try {
      const responseText = await askGPT(userText)
      const nextAiMessage = createAiMessage(pendingId, responseText)

      setMessages((previousMessages) => [
        ...previousMessages.map((message) => (message.id === pendingId ? nextAiMessage : message)),
        createSuggestionsMessage(),
      ])
    } catch (error) {
      const errorText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      const nextErrorMessage: ChatMessage = {
        id: pendingId,
        type: 'ai-text',
        text: `앗, 지금 추천을 준비하지 못했어요.\n${errorText}`,
      }

      setMessages((previousMessages) => [
        ...previousMessages.map((message) => (message.id === pendingId ? nextErrorMessage : message)),
      ])
    }
  }, [])

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }
    hasInitializedRef.current = true

    const cameraAnalysisResult = readCameraAnalysisResult()
    if (cameraAnalysisResult) {
      const userMsg: ChatMessage = { id: `user-camera-${Date.now()}`, type: 'user', text: cameraAnalysisResult.userText }
      const aiMsg = createAiMessage(`ai-camera-${Date.now()}`, cameraAnalysisResult.aiText)
      setMessages([userMsg, aiMsg, createSuggestionsMessage()])
      appendChatbotHistoryMessage(cameraAnalysisResult.userText, 'quick')
      return
    }

    const q = getInitialQuery()
    if (!q) return

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, type: 'user', text: q }
    const pendingId = `pending-${Date.now()}`
    setMessages([userMsg, { id: pendingId, type: 'ai-loading' }])
    appendChatbotHistoryMessage(q, 'quick')
    void requestAiResponse(q, pendingId)
  }, [requestAiResponse])

  useEffect(() => {
    const len = messages.length
    if (len < 2) return
    const last = messages[len - 1]
    const prev = messages[len - 2]

    if (last.type === 'ai-loading' && prev.type === 'user') {
      requestAnimationFrame(() => {
        const container = messagesRef.current
        if (!container) return
        const userMsgs = container.querySelectorAll<HTMLElement>('.chatbot-msg--user')
        const lastUserMsg = userMsgs[userMsgs.length - 1]
        if (!lastUserMsg) return
        const containerRect = container.getBoundingClientRect()
        const msgRect = lastUserMsg.getBoundingClientRect()
        container.scrollTo({
          top: container.scrollTop + (msgRect.top - containerRect.top) - 16,
          behavior: 'smooth',
        })
      })
      return
    }

    if (last.type === 'suggestions') {
      const timer = setTimeout(() => {
        messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [messages])

  const addUserMessage = (text: string) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, type: 'user', text }
    const pendingId = `pending-${Date.now()}`
    setMessages(prev => [...prev, userMsg, { id: pendingId, type: 'ai-loading' }])
    appendChatbotHistoryMessage(text, 'input')
    void requestAiResponse(text, pendingId)
  }

  const handleCameraClick = () => {
    window.location.hash = '#/chatbot-camera?from=chat'
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main className="chatbot-page" aria-label="챗봇 대화">
          <header className="chatbot-topbar">
            <button
              className="chatbot-close"
              type="button"
              aria-label="닫기"
              onClick={() => { window.location.hash = '#/home' }}
            >
              <img src={btnXIcon} alt="" aria-hidden="true" />
            </button>
          </header>

          <div ref={messagesRef} className="chatbot-chat-messages">
            <p className="chatbot-greeting">
              안녕하세요. <strong>{displayName}</strong>님!
              <br />
              오늘은 무엇을 도와드릴까요?
            </p>

            {messages.map(msg => {
              if (msg.type === 'user') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--user">
                    <span className="chatbot-bubble chatbot-bubble--user">{msg.text}</span>
                  </div>
                )
              }

              if (msg.type === 'ai-loading') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble">
                      <div className="chatbot-ai-bubble__text chatbot-loading__text">
                        냠냠크루가 준비 중입니다.
                      </div>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-recipe') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai-card">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <ChatbotRecipeCard recipe={msg.recipe} />
                  </div>
                )
              }

              if (msg.type === 'ai-text') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble">
                      <div className="chatbot-ai-bubble__text">
                        {renderBubbleText(msg.text)}
                      </div>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'suggestions') {
                return (
                  <div key={msg.id} className="chatbot-msg-suggestions">
                    {msg.items.map(item => (
                      <button
                        key={item}
                        className="chatbot-suggestion-chip"
                        type="button"
                        onClick={() => {
                          if (item === '좋아. 레시피 볼래.') {
                            window.location.hash = '#/community?recipeId=recipe-1'
                            return
                          }
                          addUserMessage(item)
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )
              }

              return null
            })}
          </div>

          <section className="chatbot-bottom">
            <ChatbotInputBar
              onSubmit={addUserMessage}
              onCameraClick={handleCameraClick}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default ChatbotChat

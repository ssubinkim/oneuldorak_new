import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, RecipeData } from '../../types/chatbot'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import chatbotMascotIcon from '../../components/chatbot/images/chatbot .svg'
import bubbleIcon from '../../components/chatbot/images/bubble.svg'
import tunamayoImage from '../../components/chatbot/images/tunamayo.svg'
import chamchimayoImage from '../../assets/images/food_imges/chamchimayo.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bulgogiImage from '../../assets/images/food_imges/bulgogi.png'
import btnXIcon from '../../components/chatbot/images/btn_x.svg'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import ChatbotCameraSheet from '../../components/chatbot/ChatbotCameraSheet'
import ChatbotRecipeCard from '../../components/chatbot/ChatbotRecipeCard'
import '../chatbot/Chatbot.css'
import './ChatbotChat.css'

type AiLoadingMessage = { id: string; type: 'ai-loading' }
type LocalMessage = ChatMessage | AiLoadingMessage

function getInitialQuery() {
  const hash = window.location.hash
  const qIndex = hash.indexOf('?q=')
  if (qIndex === -1) return ''
  return decodeURIComponent(hash.slice(qIndex + 3))
}

const MOCK_RECIPES: { recipe: RecipeData; text: string }[] = [
  {
    recipe: {
      title: '참치마요 주먹밥 도시락',
      subtitle: '간단한 아침 · 냄새 부담 적음',
      imageUrl: tunamayoImage,
      cookTime: '15분',
      estimatedCost: '약 2,500원',
      reason: '보유 재료인 밥, 김, 참치를 활용할 수 있고\n준비시간이 짧아 바쁜 아침에 좋아요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **참치마요 주먹밥 도시락** 어때요?',
  },
  {
    recipe: {
      title: '깍두기 볶음밥 도시락',
      subtitle: '든든한 한 끼 · 재료 활용 최고',
      imageUrl: kimchiRiceImage,
      cookTime: '10분',
      estimatedCost: '약 1,800원',
      reason: '냉장고 속 깍두기와 밥만 있으면 뚝딱!\n기름진 맛이 입맛 없을 때도 잘 어울려요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **깍두기 볶음밥 도시락** 어때요?',
  },
  {
    recipe: {
      title: '불고기 도시락',
      subtitle: '달콤한 양념 · 밥도둑',
      imageUrl: bulgogiImage,
      cookTime: '20분',
      estimatedCost: '약 4,000원',
      reason: '미리 재워둔 불고기를 활용하면\n바쁜 아침에도 근사한 도시락이 완성돼요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **불고기 도시락** 어때요?',
  },
  {
    recipe: {
      title: '참치마요 덮밥 도시락',
      subtitle: '고소한 맛 · 간단 조리',
      imageUrl: chamchimayoImage,
      cookTime: '10분',
      estimatedCost: '약 2,000원',
      reason: '참치캔과 마요네즈로 빠르게 만들 수 있고\n고소해서 남녀노소 누구나 좋아해요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **참치마요 덮밥 도시락** 어때요?',
  },
]

const MOCK_SUGGESTIONS = ['좋아. 레시피 볼래.', '더 가벼운 메뉴 추천해줘.', '더 든든한 메뉴로 추천해줘', '다른 메뉴 보여줘.']

function getMockAiResponse(pendingId: string): ChatMessage[] {
  const ts = Date.now()
  const { recipe, text } = MOCK_RECIPES[Math.floor(Math.random() * MOCK_RECIPES.length)]
  return [
    {
      id: pendingId,
      type: 'ai-text',
      text,
    },
    {
      id: `ai-recipe-${ts}`,
      type: 'ai-recipe',
      recipe,
    },
    {
      id: `ai-suggestions-${ts}`,
      type: 'suggestions',
      items: MOCK_SUGGESTIONS,
    },
  ]
}

function renderBubbleText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  )
}

function ChatbotChat() {
  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도시락러버'
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [showCameraSheet, setShowCameraSheet] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = getInitialQuery()
    if (!q) return

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, type: 'user', text: q }
    const pendingId = `pending-${Date.now()}`
    setMessages([userMsg, { id: pendingId, type: 'ai-loading' }])
    appendChatbotHistoryMessage(q, 'quick')

    const timer = setTimeout(() => {
      const [aiText, ...rest] = getMockAiResponse(pendingId)
      setMessages(prev => [
        ...prev.map(m => m.id === pendingId ? aiText : m),
        ...rest,
      ])
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

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

    setTimeout(() => {
      const [aiText, ...rest] = getMockAiResponse(pendingId)
      setMessages(prev => [
        ...prev.map(m => m.id === pendingId ? aiText : m),
        ...rest,
      ])
    }, 1200)
  }

  const handleTakePhoto = () => {
    setShowCameraSheet(false)
    window.location.hash = '#/chatbot-camera'
  }

  const handleSelectFromAlbum = () => {
    setShowCameraSheet(false)
    fileInputRef.current?.click()
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
                      <img className="chatbot-ai-bubble__bg" src={bubbleIcon} alt="" aria-hidden="true" />
                      <span className="chatbot-ai-bubble__text chatbot-loading__text">
                        냠냠크루가 준비 중입니다.
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-text') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble">
                      <img className="chatbot-ai-bubble__bg" src={bubbleIcon} alt="" aria-hidden="true" />
                      <span className="chatbot-ai-bubble__text">
                        {renderBubbleText(msg.text)}
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-recipe') {
                return <ChatbotRecipeCard key={msg.id} recipe={msg.recipe} />
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

          {showCameraSheet && (
            <ChatbotCameraSheet
              onTakePhoto={handleTakePhoto}
              onSelectFromAlbum={handleSelectFromAlbum}
              onClose={() => setShowCameraSheet(false)}
            />
          )}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} />

          <section className="chatbot-bottom">
            <ChatbotInputBar
              onSubmit={addUserMessage}
              onCameraClick={() => setShowCameraSheet(true)}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default ChatbotChat

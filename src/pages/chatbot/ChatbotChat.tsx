import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../../types/chatbot'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import { askGPT } from '../../api/chatApi'
import chatbotMascotIcon from '../../components/chatbot/images/chatbot .svg'
import bubbleIcon from '../../components/chatbot/images/bubble.svg'
import btnXIcon from '../../components/chatbot/images/btn_x.svg'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import ChatbotCameraSheet from '../../components/chatbot/ChatbotCameraSheet'
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

const FOLLOW_UP_SUGGESTIONS = ['좋아. 레시피 볼래.', '더 가벼운 메뉴 추천해줘.', '더 든든한 메뉴로 추천해줘', '다른 메뉴 보여줘.']

function createSuggestionsMessage(): ChatMessage {
  return {
    id: `ai-suggestions-${Date.now()}`,
    type: 'suggestions',
    items: FOLLOW_UP_SUGGESTIONS,
  }
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
  const hasInitializedRef = useRef(false)

  const requestAiResponse = useCallback(async (userText: string, pendingId: string) => {
    try {
      const responseText = await askGPT(userText)
      const nextTextMessage: ChatMessage = {
        id: pendingId,
        type: 'ai-text',
        text: responseText.trim() || '추천 결과를 만들지 못했어요. 다시 시도해 주세요.',
      }

      setMessages((previousMessages) => [
        ...previousMessages.map((message) => (message.id === pendingId ? nextTextMessage : message)),
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

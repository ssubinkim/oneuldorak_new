import { useRef, useState, type ChangeEvent } from 'react'
import '../../styles/Tailwind.css'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import chatbotHeroImage from '../../components/chatbot/images/ai_main.svg'
import btnXIcon from '../../components/chatbot/images/btn_x.svg'
import ChatbotCoachMark from '../../components/chatbot/ChatbotCoachMark'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import './Chatbot.css'

const quickSuggestions = [
  '오늘 도시락 추천',
  '주간 도시락 플랜',
  '재료별 레시피',
  '오늘 추천 재료',
  '남은 재료 활용',
  '살까말까',
]

function closeChatbot() {
  window.location.hash = '#/home'
}

function openCameraPage() {
  window.location.hash = '#/chatbot-camera'
}

function Chatbot() {
  const [showCoachMark, setShowCoachMark] = useState(true)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도시락러버'

  const openChatPage = (text: string, source: 'quick' | 'input') => {
    appendChatbotHistoryMessage(text, source)
    window.location.hash = `#/chatbot-chat?q=${encodeURIComponent(text)}`
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === '살까말까') {
      openCameraPage()
      return
    }
    openChatPage(suggestion, 'quick')
  }

  const handleSubmit = (text: string) => {
    openChatPage(text, 'input')
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleCameraChange = (event: ChangeEvent<HTMLInputElement>) => {
    // 현재는 이미지 분석 업로드 플로우가 없어서 카메라 오픈 동작만 유지
    event.currentTarget.value = ''
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main className="chatbot-page" aria-label="챗봇" onClick={() => setShowCoachMark(false)}>
          <header className="chatbot-topbar">
            <button className="chatbot-close" type="button" aria-label="닫기" onClick={closeChatbot}>
              <img src={btnXIcon} alt="" aria-hidden="true" />
            </button>
          </header>

          <section className="chatbot-content">
            <p className="chatbot-greeting">
              안녕하세요. <strong>{displayName}</strong>님!
              <br />
              오늘은 무엇을 도와드릴까요?
            </p>

            <div className="chatbot-suggestions" aria-label="추천 질문">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="chatbot-chip"
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="chatbot-hero">
              {!showCoachMark && <img src={chatbotHeroImage} alt="" aria-hidden="true" />}
            </div>
          </section>

          {showCoachMark && (
            <ChatbotCoachMark onDismiss={() => setShowCoachMark(false)} />
          )}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />

          <section className="chatbot-bottom">
            <ChatbotInputBar
              onSubmit={handleSubmit}
              onCameraClick={handleCameraClick}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default Chatbot

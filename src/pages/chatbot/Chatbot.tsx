import { useState, type FormEvent } from 'react'
import '../../styles/Tailwind.css'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import chatbotHeroImage from '../../components/chatbot/images/ai_main.svg'
import './Chatbot.css'

const quickSuggestions = [
  '오늘 도시락 추천',
  '주간 도시락 플랜',
  '재료별 레시피',
  '오늘 추천 재료',
  '남은 재료 활용',
]

function closeChatbot() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.hash = '#/home'
}

function openCameraPage() {
  window.location.hash = '#/chatbot-camera'
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.4 6.5 9.8 4.6h4.4l1.4 1.9h2.8a1.6 1.6 0 0 1 1.6 1.6v9.3a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.4V8.1a1.6 1.6 0 0 1 1.6-1.6h2.8Z" />
      <circle cx="12" cy="12.9" r="3.2" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 17V7" />
      <path d="m7.5 11 4.5-4.5 4.5 4.5" />
    </svg>
  )
}

function Chatbot() {
  const [prompt, setPrompt] = useState('')
  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도시락러버'

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
    appendChatbotHistoryMessage(suggestion, 'quick')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextPrompt = prompt.trim()
    if (!nextPrompt) {
      return
    }

    appendChatbotHistoryMessage(nextPrompt, 'input')
    setPrompt('')
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main className="chatbot-page" aria-label="챗봇">
          <header className="chatbot-topbar">
            <button className="chatbot-close" type="button" aria-label="닫기" onClick={closeChatbot}>
              <CloseIcon />
            </button>
          </header>

          <section className="chatbot-content">
            <p className="chatbot-greeting">
              안녕하세요. <strong>{displayName}님!</strong>
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
              <img src={chatbotHeroImage} alt="" aria-hidden="true" />
            </div>
          </section>

          <section className="chatbot-bottom">
            <button className="chatbot-help" type="button" aria-label="도움말">
              ?
            </button>

            <button className="chatbot-camera-widget" type="button" onClick={openCameraPage} aria-label="살까 말까 카메라 열기">
              <span className="chatbot-camera-widget-icon">
                <CameraIcon />
              </span>
              <span className="chatbot-camera-widget-label">살까 말까</span>
            </button>

            <form className="chatbot-input-bar" onSubmit={handleSubmit}>
              <input
                aria-label="댓글 입력"
                placeholder="댓글을 입력하세요"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
              <button className="chatbot-submit" type="submit" aria-label="전송">
                <SendIcon />
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Chatbot

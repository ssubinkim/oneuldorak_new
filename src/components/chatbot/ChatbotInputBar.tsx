import { useRef, useState, type FormEvent } from 'react'
import chatCameraIcon from './images/chat_camera.png'
import btnSendIcon from './images/btn_send.png'
import './ChatbotInputBar.css'

type ChatbotInputBarProps = {
  onSubmit: (text: string) => void
  onCameraClick: () => void
}

function ChatbotInputBar({ onSubmit, onCameraClick }: ChatbotInputBarProps) {
  const [prompt, setPrompt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return
    onSubmit(text)
    setPrompt('')
  }

  return (
    <form className="chatbot-input-bar" onSubmit={handleSubmit}>
      <button className="chatbot-camera" type="button" onClick={onCameraClick} aria-label="카메라 열기">
        <img src={chatCameraIcon} alt="" aria-hidden="true" />
      </button>
      <div className="chatbot-input-shell">
        <span className="chatbot-input-glow" aria-hidden="true" />
        <span className="chatbot-input-dark-border" aria-hidden="true" />
        <span className="chatbot-input-dark-border" aria-hidden="true" />
        <span className="chatbot-input-dark-border" aria-hidden="true" />
        <span className="chatbot-input-white" aria-hidden="true" />
        <span className="chatbot-input-border" aria-hidden="true" />
        <span className="chatbot-input-pink-mask" aria-hidden="true" />
        <input
          ref={inputRef}
          aria-label="챗봇 메시지 입력"
          placeholder="무엇이든 물어보세요"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button className="chatbot-submit" type="submit" aria-label="전송">
        <img src={btnSendIcon} alt="" aria-hidden="true" />
      </button>
    </form>
  )
}

export default ChatbotInputBar

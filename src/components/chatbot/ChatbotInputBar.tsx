import { useRef, useState, type FormEvent } from 'react'
import chatCameraIcon from './images/chat_camera.svg'
import btnSendIcon from './images/btn_send.svg'
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
        <input
          ref={inputRef}
          aria-label="댓글 입력"
          placeholder="댓글을 입력하세요"
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

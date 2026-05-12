import chatbotImage from './images/chatbot.png'
import './ChatBotbtn.css'

function ChatBotbtn() {
  return (
    <button
      className="chatbot-button"
      type="button"
      aria-label="챗봇 열기"
      onClick={() => {
        window.location.hash = '#/chatbot'
      }}
    >
      <img src={chatbotImage} alt="" aria-hidden="true" />
    </button>
  )
}

export default ChatBotbtn

import chatbotMascotIcon from './images/chatbot .svg'
import './ChatbotCoachMark.css'

type ChatbotCoachMarkProps = {
  onDismiss: () => void
}

function ChatbotCoachMark({ onDismiss }: ChatbotCoachMarkProps) {
  return (
    <div className="chatbot-coachmark-overlay">
      <p className="chatbot-coachmark" onClick={onDismiss} role="button" tabIndex={0} aria-label="코치마크 닫기">
        <span className="chatbot-coachmark__text">
          <span className="chatbot-coachmark__desc">살까 말까 고민될 때<br />영수증을 분석하고 싶을 때<br />가진 재료로 메뉴를 찾고 싶을 때</span>
          <span className="chatbot-coachmark__cta">카메라로 AI 기능을 경험해보세요!</span>
        </span>
        <img className="chatbot-coachmark__mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
      </p>
    </div>
  )
}

export default ChatbotCoachMark

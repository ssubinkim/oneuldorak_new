import type { AiTextMessage, AiUserMessage } from '../types/ai.types'
import chatbotMascotIcon from '../../../components/chatbot/images/chatbot .png'

type AiMessageBubbleProps = {
  message: AiTextMessage | AiUserMessage
  className?: string
}

function AiMessageBubble({ message, className = '' }: AiMessageBubbleProps) {
  const roleClass = message.role === 'user' ? 'ai-message-bubble--user' : 'ai-message-bubble--assistant'

  if (message.role === 'assistant') {
    return (
      <div className={`ai-message-row ai-message-row--assistant ${className}`.trim()}>
        <img className="ai-message-row__mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
        <article className={`ai-message-bubble ${roleClass}`.trim()}>
          <p className="ai-message-bubble__text">{message.text}</p>
        </article>
      </div>
    )
  }

  return (
    <div className={`ai-message-row ai-message-row--user ${className}`.trim()}>
      <article className={`ai-message-bubble ${roleClass}`.trim()}>
        <p className="ai-message-bubble__text">{message.text}</p>
      </article>
    </div>
  )
}

export default AiMessageBubble

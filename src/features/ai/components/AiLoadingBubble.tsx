import type { AiLoadingMessage } from '../types/ai.types'
import chatbotMascotIcon from '../../../components/chatbot/images/chatbot .png'

type AiLoadingBubbleProps = {
  message?: AiLoadingMessage
  text?: string
  className?: string
}

function AiLoadingBubble({
  message,
  text,
  className = '',
}: AiLoadingBubbleProps) {
  return (
    <div className={`ai-message-row ai-message-row--assistant ${className}`.trim()} aria-live="polite">
      <img className="ai-message-row__mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
      <article className="ai-loading-bubble">
        <p className="ai-loading-bubble__text">{text ?? message?.text ?? 'AI is preparing a response.'}</p>
      </article>
    </div>
  )
}

export default AiLoadingBubble

import type { AiChatMessage, AiChatResponse, AiFeature } from '../types/ai.types'
import AiLoadingBubble from './AiLoadingBubble'
import AiMessageBubble from './AiMessageBubble'
import './AiChatPanel.css'

type AiChatPanelProps = {
  messages: AiChatMessage[]
  isLoading?: boolean
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
  className?: string
}

function AiChatPanel({
  messages,
  isLoading = false,
  suggestions = [],
  onSuggestionClick,
  className = '',
}: AiChatPanelProps) {
  return (
    <section className={`ai-chat-panel ${className}`.trim()} aria-label="AI chat">
      <div className="ai-chat-panel__messages">
        {messages.map((message) => {
          if (message.type === 'ai-loading') {
            return <AiLoadingBubble key={message.id} message={message} />
          }

          if (message.type === 'user' || message.type === 'ai-text') {
            return <AiMessageBubble key={message.id} message={message} />
          }

          if (message.type === 'ai-recipe') {
            return (
              <article key={message.id} className="ai-recipe-summary-card">
                <h3>{message.recipe.title}</h3>
                <p>{message.recipe.subtitle}</p>
              </article>
            )
          }

          return (
            <div key={message.id} className="ai-chat-panel__suggestions">
              {message.items.map((item) => (
                <button key={item} type="button" onClick={() => onSuggestionClick?.(item)}>
                  {item}
                </button>
              ))}
            </div>
          )
        })}

        {isLoading ? <AiLoadingBubble /> : null}
      </div>

      {suggestions.length > 0 ? (
        <div className="ai-chat-panel__suggestions">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => onSuggestionClick?.(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function createPanelResponse(text: string, feature: AiFeature): AiChatResponse {
  return {
    id: `ai-component-response-${feature}`,
    feature,
    status: 'success',
    source: 'mock',
    text,
    messages: [],
    suggestions: [],
    createdAt: '',
  }
}

export default AiChatPanel

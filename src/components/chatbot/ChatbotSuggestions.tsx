import mascotImage from '../../pages/chatbot/images/todaydorak-logo.png'
import './ChatbotSuggestions.css'

const suggestions = [
  { label: '살까말까', className: 'chatbot-chip--top-left' },
  { label: '살까말까', className: 'chatbot-chip--top-right' },
  { label: '요리 알려줘', className: 'chatbot-chip--left' },
  { label: '요리 알려줘', className: 'chatbot-chip--right' },
]

function ChatbotSuggestions() {
  return (
    <section className="chatbot-hero" aria-label="추천 질문">
      {suggestions.map((suggestion) => (
        <button
          className={`chatbot-chip ${suggestion.className}`}
          type="button"
          key={`${suggestion.label}-${suggestion.className}`}
        >
          {suggestion.label}
        </button>
      ))}
      <img className="chatbot-mascot" src={mascotImage} alt="" aria-hidden="true" />
    </section>
  )
}

export default ChatbotSuggestions

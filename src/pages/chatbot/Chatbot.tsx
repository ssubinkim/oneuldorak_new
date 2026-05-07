import '../../styles/Tailwind.css'
import mascotImage from './images/todaydorak-logo.png'
import './Chatbot.css'

const suggestions = [
  { label: '살까말까', className: 'chatbot-chip--top-left' },
  { label: '살까말까', className: 'chatbot-chip--top-right' },
  { label: '요리 알려줘', className: 'chatbot-chip--left' },
  { label: '요리 알려줘', className: 'chatbot-chip--right' },
]

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.hash = '#/home'
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.4 6.5 9.8 4.6h4.4l1.4 1.9h2.8a1.6 1.6 0 0 1 1.6 1.6v9.3a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.4V8.1a1.6 1.6 0 0 1 1.6-1.6h2.8Z" />
      <circle cx="12" cy="12.9" r="3.2" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

function Chatbot() {
  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main className="chatbot-page" aria-label="챗봇">
          <div className="chatbot-topbar">
            <h1 className="chatbot-title">오늘 도락</h1>
            <button className="chatbot-back" type="button" aria-label="뒤로가기" onClick={goBack}>
              <BackIcon />
            </button>
          </div>

          <p className="chatbot-greeting">
            안녕하세요. 000님!
            <br />
            오늘은 무엇을 도와드릴까요?
          </p>

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

          <form
            className="chatbot-input-bar"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <input aria-label="하고 싶은 것 입력" placeholder="하고 싶은 것을 입력해 주세요" />
            <button className="chatbot-submit" type="submit">
              입력
            </button>
            <button className="chatbot-camera" type="button" aria-label="사진 추가">
              <CameraIcon />
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}

export default Chatbot

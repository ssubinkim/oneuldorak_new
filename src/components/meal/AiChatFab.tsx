import './AiChatFab.css'

const chatChips = ['살까말까', '요리 알려줘', '살까말까', '요리 알려줘']

interface Props {
  fabOpen: boolean
  setFabOpen: (open: boolean) => void
}

function AiChatFab({ fabOpen, setFabOpen }: Props) {
  return (
    <>
      {fabOpen && (
        <div className="fab-chips">
          {chatChips.map((chip, i) => (
            <div
              key={i}
              className="fab-chip"
              onClick={() => { window.location.hash = '#/chatbot' }}
            >
              {chip}
            </div>
          ))}
        </div>
      )}
      <button className="fab-btn" onClick={() => setFabOpen(!fabOpen)}>
        🥦
      </button>
    </>
  )
}

export default AiChatFab

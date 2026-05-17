import './ChatbotCameraSheet.css'

type ChatbotCameraSheetProps = {
  onTakePhoto: () => void
  onSelectFromAlbum: () => void
  onClose: () => void
}

function ChatbotCameraSheet({ onTakePhoto, onSelectFromAlbum, onClose }: ChatbotCameraSheetProps) {
  return (
    <div className="chatbot-sheet-overlay" onClick={onClose}>
      <div className="chatbot-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="chatbot-sheet__btn" type="button" onClick={onTakePhoto}>
          사진 촬영
        </button>
        <button className="chatbot-sheet__btn" type="button" onClick={onSelectFromAlbum}>
          앨범에서 선택
        </button>
      </div>
    </div>
  )
}

export default ChatbotCameraSheet

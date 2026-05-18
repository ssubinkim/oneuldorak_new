import './ChatbotCameraSheet.css'

type ChatbotCameraSheetProps = {
  onTakePhoto: () => void
  onSelectFromAlbum: () => void
  onClose: () => void
  title?: string
  takePhotoLabel?: string
  selectFromAlbumLabel?: string
}

function ChatbotCameraSheet({
  onTakePhoto,
  onSelectFromAlbum,
  onClose,
  title,
  takePhotoLabel = '사진 촬영',
  selectFromAlbumLabel = '앨범 선택',
}: ChatbotCameraSheetProps) {
  return (
    <div className="chatbot-sheet-overlay" onClick={onClose}>
      <div className="chatbot-sheet" onClick={(e) => e.stopPropagation()}>
        {title ? <p className="chatbot-sheet__title">{title}</p> : null}
        <div className="chatbot-sheet__tabs" role="tablist" aria-label="사진 선택 방식">
          <button className="chatbot-sheet__tab" type="button" role="tab" onClick={onTakePhoto}>
            {takePhotoLabel}
          </button>
          <button className="chatbot-sheet__tab" type="button" role="tab" onClick={onSelectFromAlbum}>
            {selectFromAlbumLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotCameraSheet

import './ChatbotCameraSheet.css'

type ChatbotCameraSheetProps = {
  onTakePhoto?: () => void
  onSelectFromAlbum?: () => void
  onClose: () => void
  title?: string
  takePhotoLabel?: string
  selectFromAlbumLabel?: string
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

function ChatbotCameraSheet({
  onTakePhoto,
  onSelectFromAlbum,
  onClose,
  title,
  takePhotoLabel = '사진 촬영',
  selectFromAlbumLabel = '앨범 선택',
  actions,
}: ChatbotCameraSheetProps) {
  const resolvedActions = actions ?? [
    { label: takePhotoLabel, onClick: onTakePhoto ?? (() => {}) },
    { label: selectFromAlbumLabel, onClick: onSelectFromAlbum ?? (() => {}) },
  ]

  return (
    <div className="chatbot-sheet-overlay" onClick={onClose}>
      <div className="chatbot-sheet" onClick={(e) => e.stopPropagation()}>
        {title ? <p className="chatbot-sheet__title">{title}</p> : null}
        <div
          className={`chatbot-sheet__tabs${resolvedActions.length === 3 ? ' is-triple' : ''}`}
          role="tablist"
          aria-label="사진 선택 방식"
        >
          {resolvedActions.map((action) => (
            <button
              key={action.label}
              className="chatbot-sheet__tab"
              type="button"
              role="tab"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatbotCameraSheet

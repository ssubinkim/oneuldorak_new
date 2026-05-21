import { useEffect, useRef, useState } from 'react'
import btnXIcon from './images/btn_x.png'
import cameraOptionIcon from './images/chat_camera.png'
import galleryOptionIcon from './images/gall.png'
import fridgeAnalyzeHeroImage from './images/camera.png'
import './ChatbotCameraSheet.css'

type ChatbotCameraSheetProps = {
  onTakePhoto?: () => void
  onSelectFromAlbum?: () => void
  onClose: () => void
  mode?: 'default' | 'fridge'
  title?: string
  description?: string
  heroImageSrc?: string
  takePhotoLabel?: string
  selectFromAlbumLabel?: string
  cancelLabel?: string
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

function ChatbotCameraSheet({
  onTakePhoto,
  onSelectFromAlbum,
  onClose,
  mode = 'default',
  title,
  description,
  heroImageSrc,
  takePhotoLabel = '사진 촬영',
  selectFromAlbumLabel = '앨범 선택',
  cancelLabel = '취소',
  actions,
}: ChatbotCameraSheetProps) {
  const resolvedActions = actions ?? [
    { label: takePhotoLabel, onClick: onTakePhoto ?? (() => {}) },
    { label: selectFromAlbumLabel, onClick: onSelectFromAlbum ?? (() => {}) },
  ]
  const isFridgeMode = mode === 'fridge'
  const [pressedActionIndex, setPressedActionIndex] = useState<number | null>(null)
  const actionTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current !== null) {
        window.clearTimeout(actionTimeoutRef.current)
      }
    }
  }, [])

  const handleActionClick = (index: number, onClick: () => void) => {
    if (!isFridgeMode) {
      onClick()
      return
    }

    setPressedActionIndex(index)
    actionTimeoutRef.current = window.setTimeout(() => {
      onClick()
    }, 110)
  }

  const resolveActionIcon = (index: number) => {
    if (!isFridgeMode) return null

    if (index === 0) return cameraOptionIcon
    if (index === 1) return galleryOptionIcon
    return null
  }

  return (
    <div className="chatbot-sheet-overlay" onClick={onClose}>
      <div className={`chatbot-sheet${isFridgeMode ? ' is-fridge' : ''}`} onClick={(e) => e.stopPropagation()}>
        {isFridgeMode ? (
          <button className="chatbot-sheet__close" type="button" aria-label="닫기" onClick={onClose}>
            <img src={btnXIcon} alt="" aria-hidden="true" />
          </button>
        ) : null}

        {title ? <p className="chatbot-sheet__title">{title}</p> : null}
        {isFridgeMode ? (
          <p className="chatbot-sheet__description">
            {description ?? '사진을 선택해 재료를 분석해보세요.'}
          </p>
        ) : null}
        {isFridgeMode ? (
          <img
            className="chatbot-sheet__hero"
            src={heroImageSrc ?? fridgeAnalyzeHeroImage}
            alt=""
            aria-hidden="true"
          />
        ) : null}

        <div
          className={`chatbot-sheet__tabs${resolvedActions.length === 3 ? ' is-triple' : ''}`}
          role="tablist"
          aria-label="사진 선택 방식"
        >
          {resolvedActions.map((action, index) => {
            const iconSrc = resolveActionIcon(index)
            const active = pressedActionIndex === index
            return (
            <button
              key={action.label}
              className={`chatbot-sheet__tab${isFridgeMode ? ' is-fridge' : ''}${active ? ' is-active' : ''}`}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleActionClick(index, action.onClick)}
            >
              {iconSrc ? (
                <span className="chatbot-sheet__tab-icon-wrap" aria-hidden="true">
                  <img src={iconSrc} alt="" className="chatbot-sheet__tab-icon" />
                </span>
              ) : null}
              {action.label}
            </button>
            )
          })}
        </div>

        {isFridgeMode ? (
          <button className="chatbot-sheet__cancel" type="button" onClick={onClose}>
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ChatbotCameraSheet

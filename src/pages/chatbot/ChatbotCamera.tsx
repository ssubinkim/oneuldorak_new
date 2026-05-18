import { useEffect, useRef, useState } from 'react'
import '../../styles/Tailwind.css'
import './ChatbotCamera.css'

type CameraPickMode = 'camera' | 'album'

function readPickModeFromRoute(): CameraPickMode | null {
  const [, queryString = ''] = window.location.hash.split('?')
  const params = new URLSearchParams(queryString)
  const pick = params.get('pick')
  if (pick === 'camera' || pick === 'album') {
    return pick
  }
  return null
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.hash = '#/chatbot'
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.4 6.5 9.8 4.6h4.4l1.4 1.9h2.8a1.6 1.6 0 0 1 1.6 1.6v9.3a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.4V8.1a1.6 1.6 0 0 1 1.6-1.6h2.8Z" />
      <circle cx="12" cy="12.9" r="3.2" />
    </svg>
  )
}

function ChatbotCamera() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [hasAutoOpenedPicker, setHasAutoOpenedPicker] = useState(false)
  const [pickMode] = useState<CameraPickMode | null>(readPickModeFromRoute)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (hasAutoOpenedPicker || !pickMode) {
      return
    }
    setHasAutoOpenedPicker(true)
    requestAnimationFrame(() => {
      fileInputRef.current?.click()
    })
  }, [hasAutoOpenedPicker, pickMode])

  const handleSelectPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0]

    if (!photo) {
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(URL.createObjectURL(photo))
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-camera-screen">
        <main className="chatbot-camera-page" aria-label="사진으로 질문하기">
          <div className="chatbot-camera-topbar">
            <button className="chatbot-camera-back" type="button" aria-label="뒤로가기" onClick={goBack}>
              <BackIcon />
            </button>
            <h1>사진으로 질문하기</h1>
          </div>

          <section className="chatbot-camera-preview" aria-label="선택한 사진">
            {previewUrl ? (
              <img src={previewUrl} alt="선택한 사진" />
            ) : (
              <div className="chatbot-camera-empty" aria-hidden="true">
                <CameraIcon />
              </div>
            )}
          </section>

          <div className="chatbot-camera-actions">
            <input
              ref={fileInputRef}
              className="chatbot-camera-input"
              type="file"
              accept="image/*"
              capture={pickMode === 'camera' ? 'environment' : undefined}
              onChange={handlePhotoChange}
            />
            <button className="chatbot-camera-select" type="button" onClick={handleSelectPhoto}>
              {pickMode === 'camera' ? '사진 촬영' : '앨범에서 선택'}
            </button>
            <button className="chatbot-camera-submit" type="button" disabled={!previewUrl}>
              분석 요청
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ChatbotCamera

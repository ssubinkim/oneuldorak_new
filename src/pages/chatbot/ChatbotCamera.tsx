import { useEffect, useRef, useState } from 'react'
import { askGPT } from '../../api/chatApi'
import '../../styles/Tailwind.css'
import './ChatbotCamera.css'

const CAMERA_ANALYSIS_STORAGE_KEY = 'oneuldorak:chatbot-camera-analysis:v1'
const CAMERA_ANALYSIS_MESSAGE = '사진 속 재료를 보고 도시락 메뉴를 추천해줘.'
const MAX_CAMERA_IMAGE_SIZE = 2_800_000
const MAX_IMAGE_DATA_URL_LENGTH = 3_600_000
const MAX_IMAGE_EDGE = 1400

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

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2.2" />
      <circle cx="9" cy="10.2" r="1.6" />
      <path d="m7 16.6 4.3-4.1 2.2 2.1 2.9-2.8L19 14.4" />
    </svg>
  )
}

function readFromRoute() {
  const [, queryString = ''] = window.location.hash.split('?')
  const params = new URLSearchParams(queryString)
  return params.get('from')
}

function goBack() {
  const fromRoute = readFromRoute()
  window.location.hash = fromRoute === 'chat' ? '#/chatbot-chat' : '#/chatbot'
}

async function loadImageFromUrl(url: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('사진 미리보기를 불러오지 못했어요.'))
    image.src = url
  })
}

async function convertImageToJpegDataUrl(file: File) {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageFromUrl(objectUrl)
    const width = image.naturalWidth || image.width
    const height = image.naturalHeight || image.height
    const ratio = Math.min(1, MAX_IMAGE_EDGE / Math.max(width, height))
    const targetWidth = Math.max(1, Math.round(width * ratio))
    const targetHeight = Math.max(1, Math.round(height * ratio))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('이미지 변환을 시작할 수 없어요.')
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight)
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.84)

    if (!jpegDataUrl.startsWith('data:image/jpeg')) {
      throw new Error('이미지 변환에 실패했어요.')
    }

    return jpegDataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function ChatbotCamera() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (!isAnalyzing) {
      return
    }

    const timer = window.setInterval(() => {
      setAnalyzingProgress((previousProgress) => {
        if (previousProgress >= 88) return previousProgress
        return Math.min(88, previousProgress + Math.floor(Math.random() * 7 + 3))
      })
    }, 150)

    return () => {
      window.clearInterval(timer)
    }
  }, [isAnalyzing])

  const handleSelectPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0]

    if (!photo) {
      return
    }

    setErrorText('')

    if (photo.size > MAX_CAMERA_IMAGE_SIZE) {
      setErrorText('사진 용량이 커서 분석이 어려워요. 조금 더 작은 사진으로 다시 찍어주세요.')
      setImageDataUrl('')
      event.currentTarget.value = ''
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(URL.createObjectURL(photo))
    try {
      const nextImageDataUrl = await convertImageToJpegDataUrl(photo)

      if (nextImageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
        throw new Error('사진 용량이 너무 커요. 조금 더 가까이 찍거나 해상도를 낮춰서 다시 시도해 주세요.')
      }

      setImageDataUrl(nextImageDataUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : '사진을 읽는 중 오류가 발생했어요.'
      setErrorText(message)
      setImageDataUrl('')
    }
  }

  const handleAnalyzeRequest = async () => {
    if (!imageDataUrl || isAnalyzing) {
      return
    }

    setErrorText('')
    setIsAnalyzing(true)
    setAnalyzingProgress(12)

    try {
      const aiText = await askGPT(CAMERA_ANALYSIS_MESSAGE, { imageDataUrl })

      setAnalyzingProgress(100)
      window.sessionStorage.setItem(
        CAMERA_ANALYSIS_STORAGE_KEY,
        JSON.stringify({
          userText: CAMERA_ANALYSIS_MESSAGE,
          aiText,
        }),
      )

      window.setTimeout(() => {
        window.location.hash = '#/chatbot-chat?from=camera'
      }, 220)
    } catch (error) {
      const message = error instanceof Error ? error.message : '분석 요청 중 오류가 발생했어요.'
      setErrorText(message)
      setIsAnalyzing(false)
      setAnalyzingProgress(0)
    }
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-camera-screen">
        <main className="chatbot-camera-page" aria-label="사진으로 질문하기">
          <div className="chatbot-camera-topbar">
            <button className="chatbot-camera-back" type="button" aria-label="뒤로가기" onClick={goBack}>
              <BackIcon />
            </button>
          </div>

          <section className="chatbot-camera-preview" aria-label="선택한 사진">
            {previewUrl ? (
              <img src={previewUrl} alt="선택한 사진" />
            ) : (
              <div className="chatbot-camera-empty" aria-hidden="true">
                <CameraIcon />
              </div>
            )}
            <div className="chatbot-camera-guide" aria-hidden="true" />
          </section>

          <div className="chatbot-camera-actions">
            <input
              ref={fileInputRef}
              className="chatbot-camera-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              capture="environment"
              onChange={handlePhotoChange}
            />
            <button className="chatbot-camera-select" type="button" onClick={handleSelectPhoto}>
              <GalleryIcon />
              <span>갤러리</span>
            </button>
            <button className="chatbot-camera-capture" type="button" aria-label="촬영" onClick={handleSelectPhoto}>
              <span className="chatbot-camera-capture__inner" />
            </button>
            <button
              className="chatbot-camera-submit"
              type="button"
              disabled={!imageDataUrl || isAnalyzing}
              onClick={handleAnalyzeRequest}
            >
              분석요청
            </button>
          </div>

          {errorText ? <p className="chatbot-camera-error">{errorText}</p> : null}

          {isAnalyzing ? (
            <section className="chatbot-camera-loading" aria-live="polite">
              <p className="chatbot-camera-loading__title">냠냠크루가 재료를 분석 중이에요</p>
              <div className="chatbot-camera-loading__bar">
                <span style={{ width: `${analyzingProgress}%` }} />
              </div>
              <p className="chatbot-camera-loading__percent">{analyzingProgress}%</p>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default ChatbotCamera

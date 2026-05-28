import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import '../../styles/Tailwind.css'
import fridgeExampleImage from '../../components/chatbot/images/food_img.jpg'
import judgeExampleImage from '../../components/chatbot/images/buy_img.jpeg'
import arrowLeftIcon from '../../assets/icons/arrow_left.svg'
import './ChatbotCamera.css'

type PhotoPurposeFeature = 'fridge-photo-analysis' | 'buy-or-not' | 'receipt-analysis'
type CameraPickMode = 'camera' | 'album'

type PurposeConfig = {
  title: string
  description: string
  primaryLabel: string
  exampleLabel: string
  previewImage: string
  feature: PhotoPurposeFeature
  analysis: 'menu' | 'judge' | 'receipt'
  query: string
}

const CHATBOT_PHOTO_DRAFT_STORAGE_KEY = 'oneuldorak:chatbot-photo-draft:v1'
const MAX_INPUT_IMAGE_FILE_SIZE = 20_000_000
const MAX_IMAGE_DATA_URL_LENGTH = 3_600_000
const IMAGE_EDGE_CANDIDATES = [1400, 1200, 1000, 900, 800, 700, 600]
const JPEG_QUALITY_CANDIDATES = [0.84, 0.72, 0.62, 0.52, 0.44]

const PURPOSE_CONFIGS: Record<PhotoPurposeFeature, PurposeConfig> = {
  'fridge-photo-analysis': {
    title: '냉장고 사진 분석',
    description: '냉장고 사진 한 장으로 재료를 분석해 재료함에 정리해드려요.',
    primaryLabel: '냉장고 분석',
    exampleLabel: '예시 냉장고 사진으로 분석하기',
    previewImage: fridgeExampleImage,
    feature: 'fridge-photo-analysis',
    analysis: 'menu',
    query: '사진을 올려서 냉장고 재료를 분석하고 싶어.',
  },
  'buy-or-not': {
    title: '살까말까 사진 판단',
    description: '사진 속 상품이나 재료를 도시락 기준으로 바로 판단해드려요.',
    primaryLabel: '살까말까 판단',
    exampleLabel: '예시 사진으로 살까말까 판단하기',
    previewImage: judgeExampleImage,
    feature: 'buy-or-not',
    analysis: 'judge',
    query: '사진으로 살까말까 판단받고 싶어.',
  },
  'receipt-analysis': {
    title: '영수증 분석',
    description: '영수증 분석은 전용 화면에서 더 자세히 볼 수 있어요.',
    primaryLabel: '영수증 분석',
    exampleLabel: '영수증 분석 페이지로 이동',
    previewImage: fridgeExampleImage,
    feature: 'receipt-analysis',
    analysis: 'receipt',
    query: '영수증 사진을 분석하고 싶어.',
  },
}

function readPurposeFromRoute(): PhotoPurposeFeature | null {
  const [, queryString = ''] = window.location.hash.split('?')
  const params = new URLSearchParams(queryString)
  const purpose = params.get('purpose')
  if (purpose === 'fridge-photo-analysis' || purpose === 'buy-or-not' || purpose === 'receipt-analysis') {
    return purpose
  }
  return null
}

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('이미지를 불러오지 못했어요.'))
    image.src = url
  })
}

function renderSourceToCanvas(
  image: HTMLImageElement,
  sourceWidth: number,
  sourceHeight: number,
  maxEdge: number,
) {
  const ratio = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight))
  const targetWidth = Math.max(1, Math.round(sourceWidth * ratio))
  const targetHeight = Math.max(1, Math.round(sourceHeight * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('이미지를 처리하지 못했어요.')
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight)
  return canvas
}

function encodeCanvasToJpegWithinLimit(canvas: HTMLCanvasElement, maxDataUrlLength: number) {
  let fallback = ''

  for (const quality of JPEG_QUALITY_CANDIDATES) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    fallback = dataUrl
    if (dataUrl.length <= maxDataUrlLength) {
      return dataUrl
    }
  }

  return fallback
}

async function convertImageToJpegDataUrl(file: File) {
  if (file.size > MAX_INPUT_IMAGE_FILE_SIZE) {
    throw new Error('사진 파일이 너무 커요. 20MB 이하 이미지로 다시 시도해 주세요.')
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageFromUrl(objectUrl)
    const width = image.naturalWidth || image.width
    const height = image.naturalHeight || image.height

    for (const edge of IMAGE_EDGE_CANDIDATES) {
      const canvas = renderSourceToCanvas(image, width, height, edge)
      const jpegDataUrl = encodeCanvasToJpegWithinLimit(canvas, MAX_IMAGE_DATA_URL_LENGTH)
      if (jpegDataUrl && jpegDataUrl.length <= MAX_IMAGE_DATA_URL_LENGTH) {
        return jpegDataUrl
      }
    }

    throw new Error('사진 용량이 커서 분석이 어려워요. 조금 더 가까이 찍거나 해상도를 낮춰서 다시 시도해 주세요.')
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function buildChatParams(config: PurposeConfig) {
  const params = new URLSearchParams()
  params.set('q', config.query)
  params.set('api', '1')
  params.set('analysis', config.analysis)
  params.set('feature', config.feature)

  if (config.feature === 'buy-or-not') {
    params.set('judge', '1')
    params.set('mode', 'photo')
  }

  return params
}

function navigateToDemoWithPurpose(config: PurposeConfig) {
  const params = buildChatParams(config)
  params.set('demo', config.feature)
  window.location.hash = `#/chatbot-chat?${params.toString()}`
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.hash = '#/chatbot'
}

function ChatbotCamera() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isPreparing, setIsPreparing] = useState(false)
  const purpose = readPurposeFromRoute() ?? 'fridge-photo-analysis'
  const config = PURPOSE_CONFIGS[purpose]

  useEffect(() => {
    if (purpose === 'receipt-analysis') {
      window.location.hash = '#/receipt-analysis'
    }
  }, [purpose])

  if (purpose === 'receipt-analysis') {
    return null
  }

  const handlePickerLabelClick = (event: MouseEvent<HTMLLabelElement>) => {
    if (isPreparing) {
      event.preventDefault()
      return
    }
    setErrorMessage('')
  }

  const handlePhotoChange = async (mode: CameraPickMode, event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0]
    if (!photo) return

    event.currentTarget.value = ''
    setErrorMessage('')
    setIsPreparing(true)

    try {
      const imageDataUrl = await convertImageToJpegDataUrl(photo)
      const displayText = mode === 'camera'
        ? '촬영 사진 첨부했어. 분석해줘.'
        : '앨범 사진 첨부했어. 분석해줘.'

      window.sessionStorage.setItem(
        CHATBOT_PHOTO_DRAFT_STORAGE_KEY,
        JSON.stringify({
          imageDataUrl,
          displayText,
          purposeFeature: config.feature,
          createdAt: Date.now(),
        }),
      )

      const params = buildChatParams(config)
      params.set('photoDraft', '1')
      params.set('pick', mode)
      window.location.hash = `#/chatbot-chat?${params.toString()}`
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '사진 선택 중 오류가 발생했어요.')
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-camera-screen">
        <main className="chatbot-camera-page chatbot-camera-page--hub" aria-label={config.title}>
          <header className="chatbot-camera-hub__topbar">
            <button className="chatbot-camera-hub__back" type="button" aria-label="뒤로가기" onClick={goBack}>
              <img src={arrowLeftIcon} alt="" aria-hidden="true" />
            </button>
            <h1>{config.title}</h1>
            <span aria-hidden="true" />
          </header>

          <section className="chatbot-camera-hub__card">
            <div className="chatbot-camera-hub__copy">
              <h2>{config.primaryLabel}</h2>
              <p>{config.description}</p>
            </div>

            <div className="chatbot-camera-hub__preview">
              <img src={config.previewImage} alt={`${config.primaryLabel} 예시 이미지`} />
            </div>

            {errorMessage ? (
              <p className="chatbot-camera-hub__error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="chatbot-camera-hub__actions">
              <label
                className="chatbot-camera-hub__action chatbot-camera-hub__action--camera"
                aria-disabled={isPreparing}
                onClick={handlePickerLabelClick}
              >
                {isPreparing ? '사진 준비 중...' : '카메라로 촬영'}
                <input
                  className="chatbot-camera-hub__file"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  disabled={isPreparing}
                  onChange={(event) => {
                    void handlePhotoChange('camera', event)
                  }}
                />
              </label>
              <label
                className="chatbot-camera-hub__action chatbot-camera-hub__action--album"
                aria-disabled={isPreparing}
                onClick={handlePickerLabelClick}
              >
                앨범에서 선택
                <input
                  className="chatbot-camera-hub__file"
                  type="file"
                  accept="image/*"
                  disabled={isPreparing}
                  onChange={(event) => {
                    void handlePhotoChange('album', event)
                  }}
                />
              </label>
              <button
                className="chatbot-camera-hub__action chatbot-camera-hub__action--demo"
                type="button"
                disabled={isPreparing}
                onClick={() => navigateToDemoWithPurpose(config)}
              >
                {config.exampleLabel}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ChatbotCamera

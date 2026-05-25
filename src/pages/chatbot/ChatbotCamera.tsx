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

function navigateToChatWithPurpose(
  config: PurposeConfig,
  mode: CameraPickMode,
) {
  const params = new URLSearchParams()
  params.set('q', config.query)
  params.set('api', '1')
  params.set('analysis', config.analysis)
  params.set('feature', config.feature)
  params.set('openPicker', '1')
  params.set('pick', mode)

  if (config.feature === 'buy-or-not') {
    params.set('judge', '1')
    params.set('mode', 'photo')
  }

  window.location.hash = `#/chatbot-chat?${params.toString()}`
}

function navigateToDemoWithPurpose(config: PurposeConfig) {
  const params = new URLSearchParams()
  params.set('q', config.query)
  params.set('api', '1')
  params.set('analysis', config.analysis)
  params.set('feature', config.feature)
  params.set('demo', config.feature)

  if (config.feature === 'buy-or-not') {
    params.set('judge', '1')
    params.set('mode', 'photo')
  }

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
  const purpose = readPurposeFromRoute() ?? 'fridge-photo-analysis'
  const config = PURPOSE_CONFIGS[purpose]

  if (purpose === 'receipt-analysis') {
    window.location.hash = '#/receipt-analysis'
    return null
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

            <div className="chatbot-camera-hub__actions">
              <button
                className="chatbot-camera-hub__action chatbot-camera-hub__action--camera"
                type="button"
                onClick={() => navigateToChatWithPurpose(config, 'camera')}
              >
                카메라로 촬영
              </button>
              <button
                className="chatbot-camera-hub__action chatbot-camera-hub__action--album"
                type="button"
                onClick={() => navigateToChatWithPurpose(config, 'album')}
              >
                앨범에서 선택
              </button>
              <button
                className="chatbot-camera-hub__action chatbot-camera-hub__action--demo"
                type="button"
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

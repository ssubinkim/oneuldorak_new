import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { ChatMessage, RecipeData } from '../../types/chatbot'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import { askGPT, type AnalysisType } from '../../api/chatApi'
import chatbotMascotIcon from '../../components/chatbot/images/chatbot .svg'
import bubbleIcon from '../../components/chatbot/images/bubble.svg'
import tunamayoImage from '../../components/chatbot/images/tunamayo.svg'
import chamchimayoImage from '../../assets/images/food_imges/chamchimayo.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bulgogiImage from '../../assets/images/food_imges/bulgogi.png'
import btnXIcon from '../../components/chatbot/images/btn_x.svg'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import ChatbotCameraSheet from '../../components/chatbot/ChatbotCameraSheet'
import ChatbotRecipeCard from '../../components/chatbot/ChatbotRecipeCard'
import '../chatbot/Chatbot.css'
import './ChatbotChat.css'

type AiLoadingMessage = { id: string; type: 'ai-loading' }
type LocalMessage = ChatMessage | AiLoadingMessage
type JudgeMode = 'text' | 'photo'
type PickerMode = 'camera' | 'album'

type ChatRouteContext = {
  query: string
  useApi: boolean
  judgeMode: JudgeMode | null
  analysisType: AnalysisType | null
  openPicker: boolean
  pick: PickerMode | null
}

type RequestOptions = {
  useApi: boolean
  requestText?: string
  imageDataUrl?: string
  analysisType?: AnalysisType
  judgeFlow?: boolean
}

function shouldUseDesktopWebcam() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const isSecure = window.isSecureContext
  if (!isSecure) {
    return false
  }

  const supportsGetUserMedia = Boolean(navigator.mediaDevices?.getUserMedia)
  if (!supportsGetUserMedia) {
    return false
  }

  const ua = navigator.userAgent.toLowerCase()
  const isMobileUa = /iphone|ipad|ipod|android|mobile|tablet/.test(ua)
  const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const hasFinePointer = window.matchMedia?.('(pointer: fine)').matches ?? false

  return !isMobileUa && (!isCoarsePointer || hasFinePointer)
}

const JUDGE_PHOTO_PROMPT = '사진 속 도시락 관련 용품이나 식재료를 오늘 도시락 기준으로 살까말까 판단해줘. 사야 하는지/보류인지와 이유, 대체 선택지를 간단히 알려줘.'

const MOCK_SUGGESTIONS = ['좋아. 레시피 볼래.', '더 가벼운 메뉴 추천해줘.', '더 든든한 메뉴로 추천해줘', '다른 메뉴 보여줘.']
const JUDGE_SUGGESTIONS = ['더 저렴한 대안도 알려줘.', '영양 기준으로 다시 판단해줘.', '사진 다시 분석할래.']

const MAX_INPUT_IMAGE_FILE_SIZE = 20_000_000
const MAX_IMAGE_DATA_URL_LENGTH = 3_600_000
const MAX_IMAGE_EDGE = 1400
const IMAGE_EDGE_CANDIDATES = [1400, 1200, 1000, 900, 800, 700, 600]
const JPEG_QUALITY_CANDIDATES = [0.84, 0.72, 0.62, 0.52, 0.44]

function readAnalysisType(value: string | null): AnalysisType | null {
  if (value === 'menu' || value === 'receipt' || value === 'judge') {
    return value
  }
  return null
}

function inferAnalysisTypeFromText(text: string, fallback: AnalysisType = 'menu'): AnalysisType {
  const normalized = text.replace(/\s+/g, '')

  if (/(영수증|지출|결제|구매내역|구매목록|합계|금액|마트)/.test(normalized)) {
    return 'receipt'
  }

  if (/(살까말까|살까|사지말|보류|가성비|판단)/.test(normalized)) {
    return 'judge'
  }

  return fallback
}

function getRouteContext(): ChatRouteContext {
  const [, queryString = ''] = window.location.hash.split('?')
  const params = new URLSearchParams(queryString)
  const routeMode = params.get('mode')
  const routePick = params.get('pick')
  const judgeMode =
    params.get('judge') === '1'
      ? routeMode === 'photo'
        ? 'photo'
        : 'text'
      : null

  return {
    query: (params.get('q') || '').trim(),
    useApi: params.get('api') === '1',
    judgeMode,
    analysisType: readAnalysisType(params.get('analysis')),
    openPicker: params.get('openPicker') === '1',
    pick: routePick === 'camera' || routePick === 'album' ? routePick : null,
  }
}

const MOCK_RECIPES: { recipe: RecipeData; text: string }[] = [
  {
    recipe: {
      title: '참치마요 주먹밥 도시락',
      subtitle: '간단한 아침 · 냄새 부담 적음',
      imageUrl: tunamayoImage,
      cookTime: '15분',
      estimatedCost: '약 2,500원',
      reason: '보유 재료인 밥, 김, 참치를 활용할 수 있고\n준비시간이 짧아 바쁜 아침에 좋아요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **참치마요 주먹밥 도시락** 어때요?',
  },
  {
    recipe: {
      title: '깍두기 볶음밥 도시락',
      subtitle: '든든한 한 끼 · 재료 활용 최고',
      imageUrl: kimchiRiceImage,
      cookTime: '10분',
      estimatedCost: '약 1,800원',
      reason: '냉장고 속 깍두기와 밥만 있으면 뚝딱!\n기름진 맛이 입맛 없을 때도 잘 어울려요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **깍두기 볶음밥 도시락** 어때요?',
  },
  {
    recipe: {
      title: '불고기 도시락',
      subtitle: '달콤한 양념 · 밥도둑',
      imageUrl: bulgogiImage,
      cookTime: '20분',
      estimatedCost: '약 4,000원',
      reason: '미리 재워둔 불고기를 활용하면\n바쁜 아침에도 근사한 도시락이 완성돼요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **불고기 도시락** 어때요?',
  },
  {
    recipe: {
      title: '참치마요 덮밥 도시락',
      subtitle: '고소한 맛 · 간단 조리',
      imageUrl: chamchimayoImage,
      cookTime: '10분',
      estimatedCost: '약 2,000원',
      reason: '참치캔과 마요네즈로 빠르게 만들 수 있고\n고소해서 남녀노소 누구나 좋아해요.',
    },
    text: '마이도락 정보를 기준으로\n오늘 먹기 좋은 도시락을 골라봤어요.\n오늘은 **참치마요 덮밥 도시락** 어때요?',
  },
]

function createSuggestionsMessage(judgeFlow: boolean): ChatMessage {
  return {
    id: `ai-suggestions-${Date.now()}`,
    type: 'suggestions',
    items: judgeFlow ? JUDGE_SUGGESTIONS : MOCK_SUGGESTIONS,
  }
}

function getMockAiResponse(pendingId: string): ChatMessage[] {
  const ts = Date.now()
  const { recipe, text } = MOCK_RECIPES[Math.floor(Math.random() * MOCK_RECIPES.length)]
  return [
    { id: pendingId, type: 'ai-text', text },
    { id: `ai-recipe-${ts}`, type: 'ai-recipe', recipe },
    createSuggestionsMessage(false),
  ]
}

function renderBubbleText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  )
}

async function loadImageFromUrl(url: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('사진 미리보기를 불러오지 못했어요.'))
    image.src = url
  })
}

function renderSourceToCanvas(
  source: CanvasImageSource,
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
    throw new Error('이미지 변환을 시작할 수 없어요.')
  }

  context.drawImage(source, 0, 0, targetWidth, targetHeight)
  return canvas
}

function encodeCanvasToJpegWithinLimit(
  canvas: HTMLCanvasElement,
  maxDataUrlLength: number,
) {
  let fallback = ''

  for (const quality of JPEG_QUALITY_CANDIDATES) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    if (!dataUrl.startsWith('data:image/jpeg')) {
      continue
    }
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

function ChatbotChat() {
  const routeContextRef = useRef<ChatRouteContext>(getRouteContext())
  const initialContext = routeContextRef.current
  const initialAnalysisType =
    initialContext.analysisType
    ?? (initialContext.judgeMode ? 'judge' : inferAnalysisTypeFromText(initialContext.query, 'menu'))

  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도시락러버'
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [showCameraSheet, setShowCameraSheet] = useState(false)
  const [showDesktopCamera, setShowDesktopCamera] = useState(false)
  const [desktopCameraError, setDesktopCameraError] = useState('')
  const [isJudgeFlow, setIsJudgeFlow] = useState(initialAnalysisType === 'judge')
  const [judgeMode, setJudgeMode] = useState<JudgeMode>(initialContext.judgeMode ?? 'text')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const desktopCameraStreamRef = useRef<MediaStream | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  const stopDesktopCamera = useCallback(() => {
    const stream = desktopCameraStreamRef.current
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      desktopCameraStreamRef.current = null
    }

    if (desktopVideoRef.current) {
      desktopVideoRef.current.srcObject = null
    }
  }, [])

  const openDesktopCamera = useCallback(async () => {
    setDesktopCameraError('')

    try {
      stopDesktopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      desktopCameraStreamRef.current = stream
      setShowDesktopCamera(true)

      requestAnimationFrame(() => {
        const video = desktopVideoRef.current
        if (!video) return
        video.srcObject = stream
        void video.play().catch(() => {})
      })
      return true
    } catch {
      setDesktopCameraError('카메라 권한을 확인해 주세요. 브라우저 설정에서 카메라 접근을 허용하면 촬영할 수 있어요.')
      setShowDesktopCamera(false)
      return false
    }
  }, [stopDesktopCamera])

  const requestAiResponse = useCallback(async (
    userText: string,
    pendingId: string,
    options: RequestOptions,
  ) => {
    try {
      if (options.useApi) {
        const responseText = await askGPT(userText, {
          imageDataUrl: options.imageDataUrl,
          analysisType: options.analysisType,
        })
        const aiMessage: ChatMessage = {
          id: pendingId,
          type: 'ai-text',
          text: responseText || '추천 결과를 만들지 못했어요. 다시 한 번 알려주세요.',
        }

        setMessages((previousMessages) => [
          ...previousMessages.map((message) => (message.id === pendingId ? aiMessage : message)),
          createSuggestionsMessage(Boolean(options.judgeFlow)),
        ])
        return
      }

      const timerResponse = await new Promise<ChatMessage[]>((resolve) => {
        window.setTimeout(() => {
          resolve(getMockAiResponse(pendingId))
        }, 1200)
      })

      setMessages((previousMessages) => {
        const pendingIndex = previousMessages.findIndex((message) => message.id === pendingId)
        if (pendingIndex === -1) return previousMessages

        const nextMessages = [...previousMessages]
        nextMessages.splice(pendingIndex, 1, ...timerResponse)
        return nextMessages
      })
    } catch (error) {
      const errorText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      const nextErrorMessage: ChatMessage = {
        id: pendingId,
        type: 'ai-text',
        text: `앗, 지금 추천을 준비하지 못했어요.\n${errorText}`,
      }

      setMessages((previousMessages) => [
        ...previousMessages.map((message) => (message.id === pendingId ? nextErrorMessage : message)),
      ])
    }
  }, [])

  const queueUserRequest = useCallback((
    displayText: string,
    source: 'quick' | 'input',
    options: RequestOptions,
  ) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, type: 'user', text: displayText }
    const pendingId = `pending-${Date.now()}`
    setMessages((prev) => [...prev, userMsg, { id: pendingId, type: 'ai-loading' }])
    appendChatbotHistoryMessage(displayText, source)
    void requestAiResponse(options.requestText ?? displayText, pendingId, options)
  }, [requestAiResponse])

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }
    hasInitializedRef.current = true

    const context = routeContextRef.current
    const normalizedQuery = context.query.replace(/\s+/g, '')
    const isJudgeRoute =
      context.judgeMode !== null
      || context.analysisType === 'judge'
      || /(살까말까|살까|판단|가성비)/.test(normalizedQuery)
    const inferredType =
      isJudgeRoute
        ? 'judge'
        : (context.analysisType ?? inferAnalysisTypeFromText(context.query, 'menu'))
    setIsJudgeFlow(isJudgeRoute)
    setJudgeMode(context.judgeMode ?? (inferredType === 'judge' ? 'photo' : 'text'))

    if (context.openPicker && context.judgeMode === null) {
      const introMessages: LocalMessage[] = []

      if (context.query) {
        introMessages.push({
          id: `user-${Date.now()}`,
          type: 'user',
          text: context.query,
        })
        appendChatbotHistoryMessage(context.query, 'quick')
      }

      introMessages.push({
        id: `ai-${Date.now()}`,
        type: 'ai-text',
        text: '좋아요! 사진을 올려주시면 바로 분석해서 추천해드릴게요.',
      })

      setMessages(introMessages)

      window.setTimeout(() => {
        setShowCameraSheet(true)
      }, 120)
      return
    }

    if (context.judgeMode === 'photo') {
      const introMessages: LocalMessage[] = []

      if (context.query) {
        introMessages.push({
          id: `user-${Date.now()}`,
          type: 'user',
          text: context.query,
        })
        appendChatbotHistoryMessage(context.query, 'quick')
      }

      introMessages.push({
        id: `ai-${Date.now()}`,
        type: 'ai-text',
        text: '좋아요! 사진을 올려주면 살까말까를 바로 판단해드릴게요.',
      })

      setMessages(introMessages)

      if (context.openPicker) {
        window.setTimeout(() => setShowCameraSheet(true), 120)
      }
      return
    }

    if (!context.query) return

    const shouldUseApi = context.useApi || context.judgeMode === 'text'
    queueUserRequest(context.query, 'quick', {
      useApi: shouldUseApi,
      analysisType: isJudgeRoute ? 'judge' : (context.analysisType ?? inferAnalysisTypeFromText(context.query, 'menu')),
      judgeFlow: isJudgeRoute,
    })
  }, [queueUserRequest])

  useEffect(() => {
    const len = messages.length
    if (len < 2) return
    const last = messages[len - 1]
    const prev = messages[len - 2]

    if (last.type === 'ai-loading' && prev.type === 'user') {
      requestAnimationFrame(() => {
        const container = messagesRef.current
        if (!container) return
        const userMsgs = container.querySelectorAll<HTMLElement>('.chatbot-msg--user')
        const lastUserMsg = userMsgs[userMsgs.length - 1]
        if (!lastUserMsg) return
        const containerRect = container.getBoundingClientRect()
        const msgRect = lastUserMsg.getBoundingClientRect()
        container.scrollTo({
          top: container.scrollTop + (msgRect.top - containerRect.top) - 16,
          behavior: 'smooth',
        })
      })
      return
    }

    if (last.type === 'suggestions') {
      const timer = setTimeout(() => {
        messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [messages])

  useEffect(() => {
    return () => {
      stopDesktopCamera()
    }
  }, [stopDesktopCamera])

  const addUserMessage = (text: string) => {
    const useApiForText = isJudgeFlow || initialContext.useApi
    const analysisType = isJudgeFlow
      ? 'judge'
      : inferAnalysisTypeFromText(text, 'judge')
    queueUserRequest(text, 'input', {
      useApi: useApiForText,
      analysisType,
      judgeFlow: isJudgeFlow,
    })
  }

  const handleTakePhoto = () => {
    setShowCameraSheet(false)
    void (async () => {
      if (shouldUseDesktopWebcam()) {
        const opened = await openDesktopCamera()
        if (!opened) {
          cameraInputRef.current?.click()
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-error-${Date.now()}`,
              type: 'ai-text',
              text: '카메라 권한이 막혀 있어 앨범 선택으로 전환했어요. 브라우저에서 카메라 권한을 허용하면 바로 촬영할 수 있어요.',
            },
          ])
        }
        return
      }

      cameraInputRef.current?.click()
    })()
  }

  const handleSelectFromAlbum = () => {
    albumInputRef.current?.click()
    setShowCameraSheet(false)
  }

  const handlePhotoChange = async (mode: PickerMode, event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0]
    if (!photo) return

    event.currentTarget.value = ''

    try {
      const imageDataUrl = await convertImageToJpegDataUrl(photo)

      const displayText = mode === 'camera'
        ? '촬영 사진 첨부했어. 분석해줘.'
        : '앨범 사진 첨부했어. 분석해줘.'
      const analysisType: AnalysisType = 'judge'
      const promptText = JUDGE_PHOTO_PROMPT
      const judgeFlow = true

      queueUserRequest(displayText, 'input', {
        useApi: true,
        requestText: promptText,
        imageDataUrl,
        analysisType,
        judgeFlow,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '사진 분석 중 오류가 발생했어요.'
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          type: 'ai-text',
          text: message,
        },
      ])
    }
  }

  const handleJudgeModeSelect = (mode: JudgeMode) => {
    setJudgeMode(mode)
    if (mode === 'photo') {
      setIsJudgeFlow(true)
      setShowCameraSheet(true)
    }
  }

  const handleDesktopCameraClose = () => {
    setShowDesktopCamera(false)
    stopDesktopCamera()
  }

  const handleDesktopCapture = () => {
    const video = desktopVideoRef.current
    if (!video || video.videoWidth <= 0 || video.videoHeight <= 0) {
      setDesktopCameraError('카메라 화면을 불러오는 중이에요. 잠시 후 다시 촬영해 주세요.')
      return
    }

    const ratio = Math.min(1, MAX_IMAGE_EDGE / Math.max(video.videoWidth, video.videoHeight))
    const targetWidth = Math.max(1, Math.round(video.videoWidth * ratio))
    const targetHeight = Math.max(1, Math.round(video.videoHeight * ratio))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')
    if (!context) {
      setDesktopCameraError('촬영 이미지를 처리하지 못했어요. 다시 시도해 주세요.')
      return
    }

    context.drawImage(video, 0, 0, targetWidth, targetHeight)
    const imageDataUrl = encodeCanvasToJpegWithinLimit(canvas, MAX_IMAGE_DATA_URL_LENGTH)

    if (!imageDataUrl) {
      setDesktopCameraError('촬영 이미지를 읽지 못했어요. 다시 시도해 주세요.')
      return
    }

    if (imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
      setDesktopCameraError('촬영 이미지가 커서 분석이 어려워요. 조금 더 가까이 촬영해 주세요.')
      return
    }

    handleDesktopCameraClose()
    const analysisType: AnalysisType = 'judge'
    const promptText = JUDGE_PHOTO_PROMPT
    const judgeFlow = true

    queueUserRequest('촬영 사진 첨부했어. 분석해줘.', 'input', {
      useApi: true,
      requestText: promptText,
      imageDataUrl,
      analysisType,
      judgeFlow,
    })
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main className="chatbot-page" aria-label="챗봇 대화">
          <header className="chatbot-topbar">
            <button
              className="chatbot-close"
              type="button"
              aria-label="닫기"
              onClick={() => { window.location.hash = '#/home' }}
            >
              <img src={btnXIcon} alt="" aria-hidden="true" />
            </button>
          </header>

          <div ref={messagesRef} className="chatbot-chat-messages">
            <p className="chatbot-greeting">
              안녕하세요. <strong>{displayName}</strong>님!
              <br />
              오늘은 무엇을 도와드릴까요?
            </p>

            {isJudgeFlow ? (
              <div className="chatbot-judge-mode" role="tablist" aria-label="살까말까 판단 방식">
                <button
                  className={`chatbot-judge-mode__chip${judgeMode === 'text' ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={judgeMode === 'text'}
                  onClick={() => handleJudgeModeSelect('text')}
                >
                  대화
                </button>
                <button
                  className={`chatbot-judge-mode__chip${judgeMode === 'photo' ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={judgeMode === 'photo'}
                  onClick={() => handleJudgeModeSelect('photo')}
                >
                  사진
                </button>
              </div>
            ) : null}

            {messages.map((msg) => {
              if (msg.type === 'user') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--user">
                    <span className="chatbot-bubble chatbot-bubble--user">{msg.text}</span>
                  </div>
                )
              }

              if (msg.type === 'ai-loading') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble">
                      <img className="chatbot-ai-bubble__bg" src={bubbleIcon} alt="" aria-hidden="true" />
                      <span className="chatbot-ai-bubble__text chatbot-loading__text">
                        냠냠크루가 준비 중입니다.
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-text') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble">
                      <img className="chatbot-ai-bubble__bg" src={bubbleIcon} alt="" aria-hidden="true" />
                      <span className="chatbot-ai-bubble__text">
                        {renderBubbleText(msg.text)}
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-recipe') {
                return <ChatbotRecipeCard key={msg.id} recipe={msg.recipe} />
              }

              if (msg.type === 'suggestions') {
                return (
                  <div key={msg.id} className="chatbot-msg-suggestions">
                    {msg.items.map((item) => (
                      <button
                        key={item}
                        className="chatbot-suggestion-chip"
                        type="button"
                        onClick={() => {
                          if (item === '좋아. 레시피 볼래.') {
                            window.location.hash = '#/community?recipeId=recipe-1'
                            return
                          }
                          if (item === '사진 다시 분석할래.') {
                            setJudgeMode('photo')
                            setIsJudgeFlow(true)
                            setShowCameraSheet(true)
                            return
                          }
                          addUserMessage(item)
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )
              }

              return null
            })}
          </div>

          {showCameraSheet ? (
            <ChatbotCameraSheet
              title={isJudgeFlow ? '사진을 어떻게 올릴까요?' : undefined}
              onTakePhoto={handleTakePhoto}
              onSelectFromAlbum={handleSelectFromAlbum}
              onClose={() => setShowCameraSheet(false)}
            />
          ) : null}

          {showDesktopCamera ? (
            <div className="chatbot-desktop-camera-overlay" role="dialog" aria-modal="true" aria-label="데스크톱 카메라 촬영">
              <div className="chatbot-desktop-camera">
                <div className="chatbot-desktop-camera__preview">
                  <video ref={desktopVideoRef} autoPlay muted playsInline />
                </div>
                {desktopCameraError ? (
                  <p className="chatbot-desktop-camera__error">{desktopCameraError}</p>
                ) : null}
                <div className="chatbot-desktop-camera__actions">
                  <button type="button" className="chatbot-desktop-camera__btn is-cancel" onClick={handleDesktopCameraClose}>
                    취소
                  </button>
                  <button type="button" className="chatbot-desktop-camera__btn is-capture" onClick={handleDesktopCapture}>
                    촬영
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{
              position: 'fixed',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
            }}
            onChange={(event) => {
              void handlePhotoChange('camera', event)
            }}
          />
          <input
            ref={albumInputRef}
            type="file"
            accept="image/*"
            style={{
              position: 'fixed',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
            }}
            onChange={(event) => {
              void handlePhotoChange('album', event)
            }}
          />

          <section className="chatbot-bottom">
            <ChatbotInputBar
              onSubmit={addUserMessage}
              onCameraClick={() => {
                setJudgeMode('photo')
                setIsJudgeFlow(true)
                setShowCameraSheet(true)
              }}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default ChatbotChat

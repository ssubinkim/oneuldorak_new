import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { ChatMessage } from '../../types/chatbot'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import { requestAiChat } from '../../features/ai/services/aiApi'
import { AI_FEATURES, type AiFeature, type AnalysisType } from '../../features/ai/types/ai.types'
import chatbotMascotIcon from '../../components/chatbot/images/chatbot .png'
import fridgeAnalyzeHeroImage from '../../components/chatbot/images/camera.png'
import btnXIcon from '../../components/chatbot/images/btn_x.png'
import eggIngredientIcon from '../../assets/images/food_icon/egg.png'
import carrotIngredientIcon from '../../assets/images/food_icon/carrot.png'
import tofuIngredientIcon from '../../assets/images/food_icon/tofu.png'
import kimchiIngredientIcon from '../../assets/images/food_icon/kimchi.png'
import cabbageIngredientIcon from '../../assets/images/food_icon/leaf_lettuce.png'
import broccoliIngredientIcon from '../../assets/images/food_icon/broccoli.png'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import ChatbotCameraSheet from '../../components/chatbot/ChatbotCameraSheet'
import ChatbotRecipeCard from '../../components/chatbot/ChatbotRecipeCard'
import '../chatbot/Chatbot.css'
import './ChatbotChat.css'

type LocalMessage = ChatMessage
type JudgeMode = 'text' | 'photo'
type PickerMode = 'camera' | 'album'

type ChatRouteContext = {
  query: string
  useApi: boolean
  judgeMode: JudgeMode | null
  analysisType: AnalysisType | null
  feature: AiFeature | null
  openPicker: boolean
  pick: PickerMode | null
}

type RequestOptions = {
  useApi: boolean
  requestText?: string
  imageDataUrl?: string
  displayImageDataUrl?: string
  analysisType?: AnalysisType
  feature?: AiFeature
  judgeFlow?: boolean
}

type FridgeIngredientCatalogItem = {
  label: string
  aliases: string[]
  icon: string
}

type FridgeDetectedIngredient = {
  id: string
  label: string
  icon: string
  selected: boolean
  needsReview: boolean
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
const FRIDGE_PHOTO_PROMPT = '냉장고 사진 속 식재료를 분석해서 확인된 재료, 먼저 써야 할 재료, 오늘 만들기 좋은 도시락 메뉴를 간단히 추천해줘.'

const MAX_INPUT_IMAGE_FILE_SIZE = 20_000_000
const MAX_IMAGE_DATA_URL_LENGTH = 3_600_000
const MAX_IMAGE_EDGE = 1400
const IMAGE_EDGE_CANDIDATES = [1400, 1200, 1000, 900, 800, 700, 600]
const JPEG_QUALITY_CANDIDATES = [0.84, 0.72, 0.62, 0.52, 0.44]
const GO_TO_CHATBOT_HOME_LABEL = '처음으로 가기'
const FRIDGE_LOADING_STEPS = ['이미지 확인 중', '재료 식별 중', '결과 정리 중', '저장 준비 중'] as const
const FRIDGE_LOADING_STEP_INTERVAL = 1800
const FRIDGE_LOADING_MIN_DURATION = 7600
const FRIDGE_RESULT_MAX_ITEMS = 4

const FRIDGE_INGREDIENT_CATALOG: FridgeIngredientCatalogItem[] = [
  { label: '계란', aliases: ['달걀', 'egg'], icon: eggIngredientIcon },
  { label: '당근', aliases: ['carrot'], icon: carrotIngredientIcon },
  { label: '두부', aliases: ['tofu'], icon: tofuIngredientIcon },
  { label: '김치', aliases: ['kimchi'], icon: kimchiIngredientIcon },
  { label: '양배추', aliases: ['cabbage'], icon: cabbageIngredientIcon },
  { label: '브로콜리', aliases: ['broccoli'], icon: broccoliIngredientIcon },
]

const FRIDGE_RESULT_FALLBACK_LABELS = ['계란', '두부', '양배추', '당근']

function normalizeIngredientToken(value: string) {
  return value
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9가-힣]/g, '')
    .toLowerCase()
}

function resolveCatalogItemByToken(token: string) {
  const normalized = normalizeIngredientToken(token)
  if (!normalized) return null

  return FRIDGE_INGREDIENT_CATALOG.find((item) =>
    [item.label, ...item.aliases].some((alias) => normalizeIngredientToken(alias) === normalized),
  ) ?? null
}

function tokenizeIngredientLine(value: string) {
  return value
    .split(/[,\n/|·ㆍ]/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function buildFridgeDetectedIngredientsFromText(text: string): FridgeDetectedIngredient[] {
  const foundItems: FridgeDetectedIngredient[] = []
  const usedLabels = new Set<string>()

  const pushCatalogItem = (item: FridgeIngredientCatalogItem, needsReview: boolean) => {
    if (usedLabels.has(item.label)) return
    usedLabels.add(item.label)
    foundItems.push({
      id: `fridge-item-${item.label}`,
      label: item.label,
      icon: item.icon,
      selected: false,
      needsReview,
    })
  }

  const listMatch = text.match(/확인된\s*재료\s*[:：]\s*([^\n]+)/)
  if (listMatch?.[1]) {
    const tokens = tokenizeIngredientLine(listMatch[1])
    tokens.forEach((token) => {
      const catalogItem = resolveCatalogItemByToken(token)
      if (catalogItem) {
        pushCatalogItem(catalogItem, false)
      }
    })
  }

  FRIDGE_INGREDIENT_CATALOG.forEach((catalogItem) => {
    if (usedLabels.has(catalogItem.label)) return
    const matched = [catalogItem.label, ...catalogItem.aliases].some((alias) =>
      text.includes(alias),
    )
    if (matched) {
      pushCatalogItem(catalogItem, false)
    }
  })

  FRIDGE_RESULT_FALLBACK_LABELS.forEach((fallbackLabel) => {
    if (foundItems.length >= FRIDGE_RESULT_MAX_ITEMS) return
    if (usedLabels.has(fallbackLabel)) return
    const catalogItem = resolveCatalogItemByToken(fallbackLabel)
    if (catalogItem) {
      pushCatalogItem(catalogItem, true)
    }
  })

  return foundItems.slice(0, FRIDGE_RESULT_MAX_ITEMS)
}

function readAnalysisType(value: string | null): AnalysisType | null {
  if (value === 'menu' || value === 'receipt' || value === 'judge') {
    return value
  }
  return null
}

function readAiFeature(value: string | null): AiFeature | null {
  if (value && AI_FEATURES.includes(value as AiFeature)) {
    return value as AiFeature
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

function getExplicitFeatureFromText(text: string): AiFeature | null {
  const normalized = text.replace(/\s+/g, '').toLowerCase()

  if (/살까말까|살까|사지마|사도돼|구매|보류|판단|가성비|buyornot/.test(normalized)) {
    return 'buy-or-not'
  }

  if (/냉장고사진|사진분석|냉장고분석|fridge/.test(normalized)) {
    return 'fridge-photo-analysis'
  }

  if (/주간|일주일|이번주|플랜|weekly|week/.test(normalized)) {
    return 'weekly-lunchbox-plan'
  }

  if (/오늘추천재료|추천재료|재료추천/.test(normalized)) {
    return 'today-recommended-ingredients'
  }

  if (/남은재료|남은|자투리|활용|leftover/.test(normalized)) {
    return 'leftover-ingredients'
  }

  if (/재료별|레시피|recipe|ingredient/.test(normalized)) {
    return 'ingredient-recipes'
  }

  if (/오늘도시락|도시락추천|메뉴추천|lunchbox/.test(normalized)) {
    return 'today-lunchbox-recommendation'
  }

  return null
}

function getAnalysisTypeForFeature(feature: AiFeature): AnalysisType {
  return feature === 'buy-or-not' ? 'judge' : 'menu'
}

function getPhotoAnalysisConfig(feature: AiFeature | null | undefined) {
  if (feature === 'fridge-photo-analysis') {
    return {
      analysisType: 'menu' as AnalysisType,
      feature: 'fridge-photo-analysis' as AiFeature,
      judgeFlow: false,
      promptText: FRIDGE_PHOTO_PROMPT,
    }
  }

  return {
    analysisType: 'judge' as AnalysisType,
    feature: 'buy-or-not' as AiFeature,
    judgeFlow: true,
    promptText: JUDGE_PHOTO_PROMPT,
  }
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
    feature: readAiFeature(params.get('feature')),
    openPicker: params.get('openPicker') === '1',
    pick: routePick === 'camera' || routePick === 'album' ? routePick : null,
  }
}

function renderBubbleText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  )
}

type AiTextDisplay = {
  bubbleText: string
  detailText: string | null
}

function summarizeAiText(text: string) {
  const normalized = text.replace(/\s+/g, '')

  if (/(사도좋아요|구매추천|구매를추천)/.test(normalized)) {
    return '오늘 기준으로는 구매해도 괜찮아요.'
  }

  if (/(보류해도좋아요|보류)/.test(normalized)) {
    return '오늘 기준으로는 보류해도 괜찮아요.'
  }

  if (/(사지않는걸추천|사지않|비추천)/.test(normalized)) {
    return '오늘 기준으로는 구매를 보류하는 게 좋아요.'
  }

  if (/(추천메뉴|활용재료|예상조리시간|간단한조리법|절약포인트)/.test(normalized)) {
    return '도시락 추천 결과를 정리해봤어요.'
  }

  if (/(총평|지출이큰항목|절약할수있는항목|장보기팁)/.test(normalized)) {
    return '영수증 분석 결과를 정리해봤어요.'
  }

  return '요청하신 내용을 보기 쉽게 정리해봤어요.'
}

function getAiTextDisplay(text: string): AiTextDisplay {
  const trimmed = text.trim()

  if (!trimmed) {
    return {
      bubbleText: '잠깐만요, 다시 정리해볼게요.',
      detailText: null,
    }
  }

  const lines = trimmed
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const structured = lines.length >= 2 && lines.some((line) => /^[-•]/.test(line) || /^\d+\./.test(line))
  const longText = trimmed.length > 84

  if (structured || longText) {
    return {
      bubbleText: summarizeAiText(trimmed),
      detailText: trimmed,
    }
  }

  return {
    bubbleText: trimmed,
    detailText: null,
  }
}

function isJudgeSuggestionText(text: string) {
  const normalized = text.replace(/\s+/g, '')
  return /(대안|영양|판단|사진|분석)/.test(normalized)
}

function applyPendingIdToFirstAssistantMessage(messages: ChatMessage[], pendingId: string): ChatMessage[] {
  return messages.map((message, index) => {
    if (index === 0 && message.type !== 'suggestions' && message.type !== 'ai-recipe') {
      return { ...message, id: pendingId }
    }
    return message
  })
}

function getFridgeLoadingOverlay(messages: LocalMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.type !== 'ai-loading' || message.feature !== 'fridge-photo-analysis') {
      continue
    }

    let imageDataUrl: string | undefined
    for (let candidateIndex = index - 1; candidateIndex >= 0; candidateIndex -= 1) {
      const candidate = messages[candidateIndex]
      if (candidate.type === 'user' && candidate.imageDataUrl) {
        imageDataUrl = candidate.imageDataUrl
        break
      }
    }

    return {
      pendingId: message.id,
      imageDataUrl,
    }
  }

  return null
}

function buildJudgeFollowupPrompt(requestText: string, subjectHint: string) {
  const subjectLine = subjectHint
    ? `직전 판단 대상 정보: ${subjectHint}`
    : '직전 판단 대상 정보가 부족하면, 어떤 상품/재료인지 1문장으로 먼저 물어봐.'

  return [
    '이전 살까말까 판단을 이어서 답해줘. 대상은 직전과 동일해.',
    subjectLine,
    `추가 요청: ${requestText}`,
    '반드시 아래 형식을 유지해:',
    '- 판단:',
    '- 이유:',
    '- 도시락 활용도:',
    '- 가격/가성비 체크:',
    '- 추천 행동:',
  ].join('\n')
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      resolve()
    }, ms)
  })
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
  const [initialContext] = useState<ChatRouteContext>(getRouteContext)
  const [initialAnalysisType] = useState<AnalysisType>(() =>
    initialContext.analysisType
    ?? (initialContext.judgeMode ? 'judge' : inferAnalysisTypeFromText(initialContext.query, 'menu')),
  )
  const routeContextRef = useRef<ChatRouteContext>(initialContext)

  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도시락러버'
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [showCameraSheet, setShowCameraSheet] = useState(false)
  const [cameraSheetFeature, setCameraSheetFeature] = useState<AiFeature | null>(initialContext.feature)
  const [showDesktopCamera, setShowDesktopCamera] = useState(false)
  const [desktopCameraError, setDesktopCameraError] = useState('')
  const [isJudgeFlow, setIsJudgeFlow] = useState(initialAnalysisType === 'judge')
  const [judgeMode, setJudgeMode] = useState<JudgeMode>(initialContext.judgeMode ?? 'text')
  const [showFridgeResultModal, setShowFridgeResultModal] = useState(false)
  const [showFridgeSavedModal, setShowFridgeSavedModal] = useState(false)
  const [fridgeDetectedIngredients, setFridgeDetectedIngredients] = useState<FridgeDetectedIngredient[]>([])
  const [savedFridgeIngredientLabels, setSavedFridgeIngredientLabels] = useState<string[]>([])
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const desktopCameraStreamRef = useRef<MediaStream | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const lastJudgeSubjectRef = useRef('')
  const lastJudgeImageDataUrlRef = useRef<string | null>(null)
  const activeFeatureRef = useRef<AiFeature | null>(initialContext.feature)
  const activeAnalysisTypeRef = useRef<AnalysisType>(initialAnalysisType)
  const hasInitializedRef = useRef(false)
  const [fridgeLoadingStep, setFridgeLoadingStep] = useState(1)
  const [dismissedFridgeLoadingId, setDismissedFridgeLoadingId] = useState<string | null>(null)
  const lastFridgeLoadingIdRef = useRef<string | null>(null)
  const fridgeLoadingStartedAtRef = useRef<Record<string, number>>({})

  const fridgeLoadingOverlay = useMemo(() => getFridgeLoadingOverlay(messages), [messages])
  const activeFridgeLoadingId = fridgeLoadingOverlay?.pendingId ?? null
  const shouldShowFridgeLoadingModal =
    Boolean(fridgeLoadingOverlay)
    && activeFridgeLoadingId !== dismissedFridgeLoadingId
  const hasSelectedFridgeIngredients = fridgeDetectedIngredients.some((ingredient) => ingredient.selected)
  const savedIngredientSummary = useMemo(() => {
    if (savedFridgeIngredientLabels.length === 0) {
      return '선택한 재료 0개가 추가됐어요'
    }
    return `${savedFridgeIngredientLabels.join(',')} ${savedFridgeIngredientLabels.length}개가 추가됐어요`
  }, [savedFridgeIngredientLabels])

  const openCameraSheet = useCallback((feature: AiFeature) => {
    setCameraSheetFeature(feature)
    setShowCameraSheet(true)
  }, [])

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

  const ensureFridgeLoadingDuration = useCallback(async (pendingId: string) => {
    const startedAt = fridgeLoadingStartedAtRef.current[pendingId]
    if (!startedAt) {
      return
    }

    const elapsed = Date.now() - startedAt
    const remaining = FRIDGE_LOADING_MIN_DURATION - elapsed
    if (remaining > 0) {
      await wait(remaining)
    }
    delete fridgeLoadingStartedAtRef.current[pendingId]
  }, [])

  const requestAiResponse = useCallback(async (
    userText: string,
    pendingId: string,
    options: RequestOptions,
  ) => {
    try {
      const response = await requestAiChat({
        message: userText,
        imageDataUrl: options.imageDataUrl,
        analysisType: options.analysisType,
        feature: options.feature,
        forceMock: !options.useApi,
      })
      await ensureFridgeLoadingDuration(pendingId)
      activeFeatureRef.current = response.feature
      activeAnalysisTypeRef.current = getAnalysisTypeForFeature(response.feature)
      const responseMessages = applyPendingIdToFirstAssistantMessage(response.messages, pendingId)

      setMessages((previousMessages) => {
        const pendingIndex = previousMessages.findIndex((message) => message.id === pendingId)
        if (pendingIndex === -1) return previousMessages

        const nextMessages = [...previousMessages]
        nextMessages.splice(pendingIndex, 1, ...responseMessages)
        return nextMessages
      })

      if (response.feature === 'fridge-photo-analysis' && response.status === 'success') {
        setFridgeDetectedIngredients(buildFridgeDetectedIngredientsFromText(response.text))
        setShowFridgeResultModal(true)
      }
    } catch (error) {
      await ensureFridgeLoadingDuration(pendingId)
      const errorText = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      const nextErrorMessage: ChatMessage = {
        id: pendingId,
        type: 'ai-text',
        role: 'assistant',
        status: 'error',
        feature: options.feature,
        source: 'api',
        createdAt: new Date().toISOString(),
        text: `앗, 지금 추천을 준비하지 못했어요.\n${errorText}`,
      }

      setMessages((previousMessages) => [
        ...previousMessages.map((message) => (message.id === pendingId ? nextErrorMessage : message)),
      ])
    }
  }, [ensureFridgeLoadingDuration])

  const queueUserRequest = useCallback((
    displayText: string,
    source: 'quick' | 'input',
    options: RequestOptions,
  ) => {
    if (options.feature) {
      activeFeatureRef.current = options.feature
    }
    if (options.analysisType) {
      activeAnalysisTypeRef.current = options.analysisType
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      role: 'user',
      status: 'success',
      feature: options.feature,
      createdAt: new Date().toISOString(),
      text: displayText,
      imageDataUrl: options.displayImageDataUrl,
    }
    const pendingId = `pending-${Date.now()}`
    if (options.feature === 'fridge-photo-analysis') {
      fridgeLoadingStartedAtRef.current[pendingId] = Date.now()
    }
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: pendingId,
        type: 'ai-loading',
        role: 'assistant',
        status: 'loading',
        feature: options.feature,
        createdAt: new Date().toISOString(),
      },
    ])
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
    if (isJudgeRoute && context.query) {
      lastJudgeSubjectRef.current = context.query
    }
    setIsJudgeFlow(isJudgeRoute)
    setJudgeMode(context.judgeMode ?? (inferredType === 'judge' ? 'photo' : 'text'))

    if (context.openPicker && context.judgeMode === null) {
      const introMessages: LocalMessage[] = []

      if (context.query) {
        introMessages.push({
          id: 'route-user-open-picker',
          type: 'user',
          role: 'user',
          status: 'success',
          feature: context.feature ?? 'fridge-photo-analysis',
          createdAt: new Date().toISOString(),
          text: context.query,
        })
        appendChatbotHistoryMessage(context.query, 'quick')
      }

      introMessages.push({
        id: 'route-ai-open-picker',
        type: 'ai-text',
        role: 'assistant',
        status: 'success',
        feature: context.feature ?? 'fridge-photo-analysis',
        createdAt: new Date().toISOString(),
        text: '좋아요! 사진을 올려주시면 바로 분석해서 추천해드릴게요.',
      })

      setMessages(introMessages)

      window.setTimeout(() => {
        openCameraSheet(context.feature ?? 'fridge-photo-analysis')
      }, 120)
      return
    }

    if (context.judgeMode === 'photo') {
      const introMessages: LocalMessage[] = []

      if (context.query) {
        introMessages.push({
          id: 'route-user-photo',
          type: 'user',
          role: 'user',
          status: 'success',
          feature: context.feature ?? 'buy-or-not',
          createdAt: new Date().toISOString(),
          text: context.query,
        })
        appendChatbotHistoryMessage(context.query, 'quick')
      }

      introMessages.push({
        id: 'route-ai-photo',
        type: 'ai-text',
        role: 'assistant',
        status: 'success',
        feature: context.feature ?? 'buy-or-not',
        createdAt: new Date().toISOString(),
        text: '좋아요! 사진을 올려주면 살까말까를 바로 판단해드릴게요.',
      })

      setMessages(introMessages)

      if (context.openPicker) {
        window.setTimeout(() => openCameraSheet(context.feature ?? 'buy-or-not'), 120)
      }
      return
    }

    if (!context.query) return

    const shouldUseApi = context.useApi || context.judgeMode === 'text'
    queueUserRequest(context.query, 'quick', {
      useApi: shouldUseApi,
      analysisType: isJudgeRoute ? 'judge' : (context.analysisType ?? inferAnalysisTypeFromText(context.query, 'menu')),
      feature: context.feature ?? undefined,
      judgeFlow: isJudgeRoute,
    })
  }, [openCameraSheet, queueUserRequest])

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

  useEffect(() => {
    if (!activeFridgeLoadingId) {
      lastFridgeLoadingIdRef.current = null
      setDismissedFridgeLoadingId(null)
      setFridgeLoadingStep(1)
      return
    }

    if (lastFridgeLoadingIdRef.current !== activeFridgeLoadingId) {
      lastFridgeLoadingIdRef.current = activeFridgeLoadingId
      setDismissedFridgeLoadingId(null)
      setFridgeLoadingStep(1)
    }
  }, [activeFridgeLoadingId])

  useEffect(() => {
    if (!shouldShowFridgeLoadingModal) {
      return
    }

    const timer = window.setInterval(() => {
      setFridgeLoadingStep((previousStep) => (
        previousStep >= FRIDGE_LOADING_STEPS.length
          ? previousStep
          : previousStep + 1
      ))
    }, FRIDGE_LOADING_STEP_INTERVAL)

    return () => {
      window.clearInterval(timer)
    }
  }, [shouldShowFridgeLoadingModal])

  const toggleFridgeIngredient = useCallback((id: string) => {
    setFridgeDetectedIngredients((previousIngredients) => previousIngredients.map((ingredient) => (
      ingredient.id === id
        ? { ...ingredient, selected: !ingredient.selected }
        : ingredient
    )))
  }, [])

  const handleAddSelectedIngredients = useCallback(() => {
    const selectedIngredients = fridgeDetectedIngredients.filter((ingredient) => ingredient.selected)
    if (selectedIngredients.length === 0) return

    setSavedFridgeIngredientLabels(selectedIngredients.map((ingredient) => ingredient.label))
    setFridgeDetectedIngredients((previousIngredients) => previousIngredients.map((ingredient) => ({
      ...ingredient,
      selected: false,
    })))
    setShowFridgeResultModal(false)
    setShowFridgeSavedModal(true)
  }, [fridgeDetectedIngredients])

  const addUserMessage = (text: string) => {
    if (isJudgeFlow) {
      if (!isJudgeSuggestionText(text)) {
        lastJudgeSubjectRef.current = text
      }

      queueUserRequest(text, 'input', {
        useApi: true,
        analysisType: 'judge',
        feature: 'buy-or-not',
        judgeFlow: true,
        requestText: buildJudgeFollowupPrompt(text, lastJudgeSubjectRef.current),
        imageDataUrl: judgeMode === 'photo' ? (lastJudgeImageDataUrlRef.current ?? undefined) : undefined,
      })
      return
    }

    const explicitFeature = getExplicitFeatureFromText(text)
    const nextFeature = explicitFeature ?? activeFeatureRef.current ?? initialContext.feature ?? undefined
    const nextAnalysisType = explicitFeature
      ? getAnalysisTypeForFeature(explicitFeature)
      : inferAnalysisTypeFromText(text, activeAnalysisTypeRef.current === 'judge' ? 'menu' : activeAnalysisTypeRef.current)
    const nextJudgeFlow = nextAnalysisType === 'judge' || nextFeature === 'buy-or-not'

    if (nextJudgeFlow) {
      setIsJudgeFlow(true)
      setJudgeMode('text')
      lastJudgeSubjectRef.current = text
    }

    queueUserRequest(text, 'input', {
      useApi: initialContext.useApi,
      analysisType: nextAnalysisType,
      feature: nextFeature,
      judgeFlow: nextJudgeFlow,
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
              role: 'assistant',
              status: 'error',
              feature: activeFeatureRef.current ?? initialContext.feature ?? 'buy-or-not',
              source: 'api',
              createdAt: new Date().toISOString(),
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
      const { analysisType, feature, judgeFlow, promptText } = getPhotoAnalysisConfig(
        activeFeatureRef.current ?? initialContext.feature,
      )
      lastJudgeImageDataUrlRef.current = imageDataUrl
      if (judgeFlow) {
        lastJudgeSubjectRef.current = displayText
      }
      setIsJudgeFlow(judgeFlow)
      activeFeatureRef.current = feature
      activeAnalysisTypeRef.current = analysisType

      queueUserRequest(displayText, 'input', {
        useApi: true,
        requestText: promptText,
        imageDataUrl,
        displayImageDataUrl: imageDataUrl,
        analysisType,
        feature,
        judgeFlow,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '사진 분석 중 오류가 발생했어요.'
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          type: 'ai-text',
          role: 'assistant',
          status: 'error',
          feature: activeFeatureRef.current ?? initialContext.feature ?? 'buy-or-not',
          source: 'api',
          createdAt: new Date().toISOString(),
          text: message,
        },
      ])
    }
  }

  const handleJudgeModeSelect = (mode: JudgeMode) => {
    setJudgeMode(mode)
    setIsJudgeFlow(true)
    if (mode === 'photo') {
      openCameraSheet('buy-or-not')
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
    const { analysisType, feature, judgeFlow, promptText } = getPhotoAnalysisConfig(
      activeFeatureRef.current ?? initialContext.feature,
    )
    lastJudgeImageDataUrlRef.current = imageDataUrl
    if (judgeFlow) {
      lastJudgeSubjectRef.current = '촬영 사진 첨부했어. 분석해줘.'
    }
    setIsJudgeFlow(judgeFlow)
    activeFeatureRef.current = feature
    activeAnalysisTypeRef.current = analysisType

    queueUserRequest('촬영 사진 첨부했어. 분석해줘.', 'input', {
      useApi: true,
      requestText: promptText,
      imageDataUrl,
      displayImageDataUrl: imageDataUrl,
      analysisType,
      feature,
      judgeFlow,
    })
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main className="chatbot-page chatbot-page--chat" aria-label="챗봇 대화">
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
                const hasUserImage = Boolean(msg.imageDataUrl)
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--user">
                    <span className={`chatbot-bubble chatbot-bubble--user${hasUserImage ? ' chatbot-bubble--user-with-image' : ''}`}>
                      {msg.imageDataUrl ? (
                        <img className="chatbot-bubble__image" src={msg.imageDataUrl} alt="첨부한 사진" />
                      ) : null}
                      {hasUserImage ? <span className="chatbot-bubble__text">{msg.text}</span> : msg.text}
                    </span>
                  </div>
                )
              }

              if (msg.type === 'ai-loading') {
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble">
                      <span className="chatbot-ai-bubble__text chatbot-loading__text">
                        {msg.text ?? '냠냠크루가 준비 중입니다.'}
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-text') {
                const bubbleText = msg.text.trim() ? msg.text : getAiTextDisplay(msg.text).bubbleText
                return (
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-stack">
                      <div className="chatbot-ai-bubble">
                        <span className="chatbot-ai-bubble__text">
                          {renderBubbleText(bubbleText)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-recipe') {
                return <ChatbotRecipeCard key={msg.id} recipe={msg.recipe} />
              }

              if (msg.type === 'suggestions') {
                const suggestionItems = msg.items.includes(GO_TO_CHATBOT_HOME_LABEL)
                  ? msg.items
                  : [...msg.items, GO_TO_CHATBOT_HOME_LABEL]

                return (
                  <div key={msg.id} className="chatbot-msg-suggestions">
                    {suggestionItems.map((item) => (
                      <button
                        key={item}
                        className="chatbot-suggestion-chip"
                        type="button"
                        onClick={() => {
                          if (item === GO_TO_CHATBOT_HOME_LABEL) {
                            window.location.hash = '#/chatbot'
                            return
                          }
                          if (item.includes('레시피 보러')) {
                            window.location.hash = '#/community?recipeId=recipe-1'
                            return
                          }
                          if (item.includes('사진') && item.includes('다시')) {
                            setJudgeMode('photo')
                            setIsJudgeFlow(true)
                            openCameraSheet('buy-or-not')
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
              mode={!isJudgeFlow && cameraSheetFeature === 'fridge-photo-analysis' ? 'fridge' : 'default'}
              title={
                !isJudgeFlow && cameraSheetFeature === 'fridge-photo-analysis'
                  ? '냉장고 사진 분석'
                  : (isJudgeFlow ? '사진을 어떻게 올릴까요?' : undefined)
              }
              description={!isJudgeFlow && cameraSheetFeature === 'fridge-photo-analysis' ? '사진을 선택해 재료를 분석해보세요.' : undefined}
              takePhotoLabel={!isJudgeFlow && cameraSheetFeature === 'fridge-photo-analysis' ? '카메라로 찍기' : undefined}
              selectFromAlbumLabel={!isJudgeFlow && cameraSheetFeature === 'fridge-photo-analysis' ? '앨범에서 선택' : undefined}
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

          {shouldShowFridgeLoadingModal && fridgeLoadingOverlay ? (
            <div className="chatbot-fridge-loading-overlay" role="dialog" aria-modal="true" aria-label="냉장고 분석 중">
              <section className="chatbot-fridge-loading">
                <button
                  className="chatbot-fridge-loading__close"
                  type="button"
                  aria-label="로딩 창 닫기"
                  onClick={() => {
                    if (!activeFridgeLoadingId) return
                    setDismissedFridgeLoadingId(activeFridgeLoadingId)
                  }}
                >
                  <img src={btnXIcon} alt="" aria-hidden="true" />
                </button>
                <h2 className="chatbot-fridge-loading__title">AI가 재료를 찾고 있어요</h2>

                <div className="chatbot-fridge-loading__visual">
                  {fridgeLoadingOverlay.imageDataUrl ? (
                    <img
                      className="chatbot-fridge-loading__photo"
                      src={fridgeLoadingOverlay.imageDataUrl}
                      alt="분석 중인 사진"
                    />
                  ) : null}
                  <div className="chatbot-fridge-loading__visual-dim" aria-hidden="true" />
                  <img
                    className="chatbot-fridge-loading__mascot"
                    src={fridgeAnalyzeHeroImage}
                    alt=""
                    aria-hidden="true"
                  />
                </div>

                <ol className="chatbot-fridge-loading__progress" aria-label="분석 진행 단계">
                  {FRIDGE_LOADING_STEPS.map((_, index) => {
                    const stepNumber = index + 1
                    const isActive = stepNumber === fridgeLoadingStep
                    const isDone = stepNumber < fridgeLoadingStep
                    return (
                      <li key={stepNumber} className="chatbot-fridge-loading__progress-item">
                        <span
                          className={`chatbot-fridge-loading__progress-dot${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                          aria-current={isActive ? 'step' : undefined}
                        >
                          {isDone ? '✓' : stepNumber}
                        </span>
                      </li>
                    )
                  })}
                </ol>

                <ol className="chatbot-fridge-loading__checklist" aria-live="polite">
                  {FRIDGE_LOADING_STEPS.map((label, index) => {
                    const stepNumber = index + 1
                    const isDone = stepNumber < fridgeLoadingStep
                    const isActive = stepNumber === fridgeLoadingStep
                    return (
                      <li key={label} className={`chatbot-fridge-loading__check-item${isActive ? ' is-active' : ''}`}>
                        <span className={`chatbot-fridge-loading__check-icon${isDone ? ' is-done' : ''}`}>
                          {isDone ? '✓' : stepNumber}
                        </span>
                        <span>{label}</span>
                      </li>
                    )
                  })}
                </ol>

                <p className="chatbot-fridge-loading__hint">잠시만 기다려 주세요....</p>
              </section>
            </div>
          ) : null}

          {showFridgeResultModal ? (
            <div className="chatbot-fridge-result-overlay" role="dialog" aria-modal="true" aria-label="분석 재료 선택">
              <section className="chatbot-fridge-result-modal">
                <button
                  className="chatbot-fridge-result-modal__close"
                  type="button"
                  aria-label="재료 선택 창 닫기"
                  onClick={() => setShowFridgeResultModal(false)}
                >
                  <img src={btnXIcon} alt="" aria-hidden="true" />
                </button>
                <h2 className="chatbot-fridge-result-modal__title">AI가 찾은 재료예요</h2>
                <p className="chatbot-fridge-result-modal__description">재료함에 추가할 항목을 확인 해주세요</p>

                <ul className="chatbot-fridge-result-modal__list">
                  {fridgeDetectedIngredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      <button
                        className="chatbot-fridge-result-modal__item"
                        type="button"
                        onClick={() => toggleFridgeIngredient(ingredient.id)}
                      >
                        <span
                          className={`chatbot-fridge-result-modal__check${ingredient.selected ? ' is-selected' : ''}`}
                          aria-hidden="true"
                        >
                          {ingredient.selected ? '✓' : ''}
                        </span>
                        <img
                          className="chatbot-fridge-result-modal__icon"
                          src={ingredient.icon}
                          alt=""
                          aria-hidden="true"
                        />
                        <span className="chatbot-fridge-result-modal__name">{ingredient.label}</span>
                        {ingredient.needsReview ? (
                          <span className="chatbot-fridge-result-modal__badge">확인필요</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="chatbot-fridge-result-modal__actions">
                  <button
                    className="chatbot-fridge-result-modal__action chatbot-fridge-result-modal__action--secondary"
                    type="button"
                  >
                    직접 추가
                  </button>
                  <button
                    className="chatbot-fridge-result-modal__action chatbot-fridge-result-modal__action--primary"
                    type="button"
                    disabled={!hasSelectedFridgeIngredients}
                    onClick={handleAddSelectedIngredients}
                  >
                    선택한 재료 추가
                  </button>
                </div>
              </section>
            </div>
          ) : null}

          {showFridgeSavedModal ? (
            <div className="chatbot-fridge-saved-overlay" role="dialog" aria-modal="true" aria-label="재료 추가 완료">
              <section className="chatbot-fridge-saved-modal">
                <button
                  className="chatbot-fridge-saved-modal__close"
                  type="button"
                  aria-label="저장 완료 창 닫기"
                  onClick={() => setShowFridgeSavedModal(false)}
                >
                  <img src={btnXIcon} alt="" aria-hidden="true" />
                </button>

                <div className="chatbot-fridge-saved-modal__check" aria-hidden="true">✓</div>
                <div className="chatbot-fridge-saved-modal__confetti" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <img
                  className="chatbot-fridge-saved-modal__hero"
                  src={fridgeAnalyzeHeroImage}
                  alt=""
                  aria-hidden="true"
                />

                <h2 className="chatbot-fridge-saved-modal__title">재료함에 저장했어요!</h2>
                <p className="chatbot-fridge-saved-modal__desc">{savedIngredientSummary}</p>
                <p className="chatbot-fridge-saved-modal__sub">이 재료로 도시락 추천을 받을까요?</p>

                <div className="chatbot-fridge-saved-modal__actions">
                  <button
                    className="chatbot-fridge-saved-modal__action chatbot-fridge-saved-modal__action--primary"
                    type="button"
                    onClick={() => setShowFridgeSavedModal(false)}
                  >
                    도시락 추천 받기
                  </button>
                  <button
                    className="chatbot-fridge-saved-modal__action chatbot-fridge-saved-modal__action--secondary"
                    type="button"
                    onClick={() => setShowFridgeSavedModal(false)}
                  >
                    재료함 보러가기
                  </button>
                </div>
              </section>
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

          {!showCameraSheet && !showDesktopCamera ? (
            <section className="chatbot-bottom">
              <ChatbotInputBar
                onSubmit={addUserMessage}
                onCameraClick={() => {
                  setJudgeMode('photo')
                  setIsJudgeFlow(true)
                  openCameraSheet('buy-or-not')
                }}
              />
            </section>
          ) : null}
        </main>
      </div>
    </div>
  )
}

export default ChatbotChat

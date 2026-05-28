import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type UIEvent } from 'react'
import type { ChatMessage } from '../../types/chatbot'
import { appendChatbotFridgeIngredients, appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import { requestAiChat } from '../../features/ai/services/aiApi'
import { analyzeReceiptImage } from '../../features/ai/services/receiptApi'
import { buildReceiptAnalysisChatText } from '../../features/ai/services/receiptChatFormatter'
import { AI_FEATURES, type AiFeature, type AnalysisType, type RecipeData } from '../../features/ai/types/ai.types'
import chatbotMascotIcon from '../../components/chatbot/images/chatbot .png'
import defaultRecipeImage from '../../components/chatbot/images/tunamayo.png'
import fridgeLoadingMascotImage from '../../components/chatbot/images/ser.png'
import fridgeSavedHeroImage from '../../components/chatbot/images/com.png'
import fridgeDemoImage from '../../components/chatbot/images/food_img.jpg'
import judgeDemoImage from '../../components/chatbot/images/buy_img.jpeg'
import receiptDemoImage from '../../components/chatbot/images/re_img.png'
import checkIcon from '../../components/chatbot/images/check.svg'
import xIcon from '../../components/chatbot/images/x.svg'
import eggIngredientIcon from '../../assets/images/food_icon/egg.png'
import carrotIngredientIcon from '../../assets/images/food_icon/carrot.png'
import tofuIngredientIcon from '../../assets/images/food_icon/tofu.png'
import kimchiIngredientIcon from '../../assets/images/food_icon/kimchi.png'
import cabbageIngredientIcon from '../../assets/images/food_icon/leaf_lettuce.png'
import broccoliIngredientIcon from '../../assets/images/food_icon/broccoli.png'
import onionIngredientIcon from '../../assets/images/food_icon/onion.png'
import tomatoIngredientIcon from '../../assets/images/food_icon/tomato.png'
import potatoIngredientIcon from '../../assets/images/food_icon/potato.png'
import mushroomIngredientIcon from '../../assets/images/food_icon/mushroom.png'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import ChatbotCameraSheet from '../../components/chatbot/ChatbotCameraSheet'
import ChatbotRecipeCard from '../../components/chatbot/ChatbotRecipeCard'
import '../chatbot/Chatbot.css'
import './ChatbotChat.css'

type LocalMessage = ChatMessage
type JudgeMode = 'text' | 'photo'
type PickerMode = 'camera' | 'album'
type PhotoPurposeFeature = 'receipt-analysis' | 'fridge-photo-analysis' | 'buy-or-not'

type ChatRouteContext = {
  query: string
  useApi: boolean
  judgeMode: JudgeMode | null
  analysisType: AnalysisType | null
  feature: AiFeature | null
  demoPurpose: PhotoPurposeFeature | null
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
  suppressRecipeCard?: boolean
}

type ChatApiResponse = Awaited<ReturnType<typeof requestAiChat>>

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
const RECEIPT_PHOTO_PROMPT = '영수증 사진을 분석해서 구매 항목, 합계 금액, 도시락에 활용할 수 있는 재료, 절약 팁을 간단히 정리해줘.'

const MAX_INPUT_IMAGE_FILE_SIZE = 20_000_000
const MAX_IMAGE_DATA_URL_LENGTH = 3_600_000
const MAX_IMAGE_EDGE = 1400
const IMAGE_EDGE_CANDIDATES = [1400, 1200, 1000, 900, 800, 700, 600]
const JPEG_QUALITY_CANDIDATES = [0.84, 0.72, 0.62, 0.52, 0.44]
const GO_TO_CHATBOT_HOME_LABEL = '처음으로 가기'
const FRIDGE_LOADING_STEPS = ['이미지 확인 중', '재료 식별 중', '결과 정리 중', '저장 준비 중'] as const
const FRIDGE_LOADING_STEP_INTERVAL = 1800
const FRIDGE_LOADING_MIN_DURATION = 7600
const FRIDGE_RESULT_MAX_ITEMS = 8

const FEATURE_FOLLOWUP_SUGGESTIONS: Record<AiFeature, string[]> = {
  'today-lunchbox-recommendation': [
    '더 저렴하게 바꿔줘',
    '단백질을 더해줘',
    '주간 도시락 플랜도 보여줘',
  ],
  'weekly-lunchbox-plan': [
    '장보기 재료로 정리해줘',
    '오늘 메뉴만 다시 추천해줘',
    '더 저렴하게 바꿔줘',
  ],
  'ingredient-recipes': [
    '다른 재료 조합도 추천해줘',
    '단백질을 더해줘',
    '남은 재료 활용으로 바꿔줘',
  ],
  'today-recommended-ingredients': [
    '이 재료로 레시피 추천해줘',
    '예산 5천원 안으로 골라줘',
    '보관 쉬운 재료만 보여줘',
  ],
  'leftover-ingredients': [
    '먼저 써야 할 순서로 정리해줘',
    '오늘 도시락으로 바꿔줘',
    '재료별 레시피도 보여줘',
  ],
  'buy-or-not': [
    '대안도 추천해줘',
    '가성비를 더 자세히 봐줘',
    '사진으로 다시 판단해줘',
  ],
  'fridge-photo-analysis': [
    '이 재료로 도시락 추천해줘',
    '남은 재료 활용으로 바꿔줘',
    '사진 다시 분석할래',
  ],
  'receipt-analysis': [
    '추천 메뉴 더 보여줘',
    '절약 포인트 더 알려줘',
    '장보기 목록으로 정리해줘',
  ],
}

const FRIDGE_INGREDIENT_CATALOG: FridgeIngredientCatalogItem[] = [
  { label: '계란', aliases: ['달걀', 'egg'], icon: eggIngredientIcon },
  { label: '당근', aliases: ['carrot'], icon: carrotIngredientIcon },
  { label: '두부', aliases: ['tofu'], icon: tofuIngredientIcon },
  { label: '김치', aliases: ['kimchi'], icon: kimchiIngredientIcon },
  { label: '양배추', aliases: ['cabbage'], icon: cabbageIngredientIcon },
  { label: '브로콜리', aliases: ['broccoli'], icon: broccoliIngredientIcon },
  { label: '양파', aliases: ['onion'], icon: onionIngredientIcon },
  { label: '토마토', aliases: ['tomato'], icon: tomatoIngredientIcon },
  { label: '감자', aliases: ['potato'], icon: potatoIngredientIcon },
  { label: '버섯', aliases: ['mushroom'], icon: mushroomIngredientIcon },
]

const FRIDGE_RESULT_FALLBACK_LABELS = ['계란', '두부', '양배추', '당근', '김치', '브로콜리', '양파', '토마토']

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

  if (foundItems.length === 0) {
    FRIDGE_RESULT_FALLBACK_LABELS.forEach((fallbackLabel) => {
      if (foundItems.length >= FRIDGE_RESULT_MAX_ITEMS) return
      if (usedLabels.has(fallbackLabel)) return
      const catalogItem = resolveCatalogItemByToken(fallbackLabel)
      if (catalogItem) {
        pushCatalogItem(catalogItem, true)
      }
    })
  }

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

function readPhotoPurposeFeature(value: string | null): PhotoPurposeFeature | null {
  if (value === 'receipt-analysis' || value === 'fridge-photo-analysis' || value === 'buy-or-not') {
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
  if (feature === 'buy-or-not') return 'judge'
  if (feature === 'receipt-analysis') return 'receipt'
  return 'menu'
}

function isPhotoPurposeFeature(feature: AiFeature | null | undefined): feature is PhotoPurposeFeature {
  return feature === 'receipt-analysis' || feature === 'fridge-photo-analysis' || feature === 'buy-or-not'
}

function getPhotoPurposeFromContext(
  feature: AiFeature | null | undefined,
  analysisType: AnalysisType | null | undefined,
): PhotoPurposeFeature | null {
  if (isPhotoPurposeFeature(feature)) {
    return feature
  }

  if (analysisType === 'judge') {
    return 'buy-or-not'
  }

  if (analysisType === 'receipt') {
    return 'receipt-analysis'
  }

  return null
}

function getPhotoAnalysisConfig(feature: PhotoPurposeFeature) {
  if (feature === 'receipt-analysis') {
    return {
      analysisType: 'receipt' as AnalysisType,
      feature: 'receipt-analysis' as AiFeature,
      judgeFlow: false,
      promptText: RECEIPT_PHOTO_PROMPT,
    }
  }

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

function getDemoImageSrcForPurpose(feature: PhotoPurposeFeature) {
  if (feature === 'receipt-analysis') {
    return receiptDemoImage
  }

  if (feature === 'fridge-photo-analysis') {
    return fridgeDemoImage
  }

  return judgeDemoImage
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
    demoPurpose: readPhotoPurposeFeature(params.get('demo')),
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

type JudgeResultField = {
  key: string
  title: string
  aliases: string[]
}

type JudgeResultSection = {
  key: string
  title: string
  content: string
}

type JudgeResultDisplay = {
  title: string
  subtitle: string
  sections: JudgeResultSection[]
}

type RecommendationField = {
  key: 'menu' | 'ingredients' | 'extra' | 'cookTime' | 'cost' | 'method' | 'saving' | 'reason'
  aliases: string[]
}

const JUDGE_RESULT_FIELDS: JudgeResultField[] = [
  { key: 'decision', title: '판단', aliases: ['판단', '구매 판단'] },
  { key: 'reason', title: '이유', aliases: ['이유'] },
  { key: 'lunchbox', title: '도시락 활용도', aliases: ['도시락 활용도', '활용도'] },
  { key: 'price', title: '가격/가성비 체크', aliases: ['가격/가성비 체크', '가격', '가성비', '가성비 체크'] },
  { key: 'action', title: '추천 행동', aliases: ['추천 행동', '추천'] },
]

const RECOMMENDATION_CARD_FIELDS: RecommendationField[] = [
  { key: 'menu', aliases: ['추천 메뉴', '추천메뉴', '오늘 추천 메뉴', '오늘추천메뉴', '추천 도시락', '추천도시락', '메뉴'] },
  { key: 'ingredients', aliases: ['활용 재료', '활용재료', '먼저 쓸 재료', '먼저쓸재료', '먼저 써야 할 재료', '먼저써야할재료', '사용 재료', '사용재료', '보유 재료', '보유재료', '재료'] },
  { key: 'extra', aliases: ['추가로 있으면 좋은 재료', '추가 재료', '추가재료'] },
  { key: 'cookTime', aliases: ['예상 조리 시간', '예상조리시간', '조리 시간', '조리시간'] },
  { key: 'cost', aliases: ['예상 식비', '예상식비', '식비', '비용', '가격'] },
  { key: 'method', aliases: ['간단한 조리법', '간단한조리법', '활용 방법', '활용방법', '사용 방법', '사용방법', '조리법', '만드는 법', '만드는법'] },
  { key: 'saving', aliases: ['절약 포인트', '절약포인트'] },
  { key: 'reason', aliases: ['추천 이유', '추천이유', '이유'] },
]

const RECOMMENDATION_CARD_FEATURES = new Set<AiFeature>([
  'today-lunchbox-recommendation',
  'ingredient-recipes',
  'leftover-ingredients',
])

function normalizeJudgeFieldLabel(label: string) {
  return label.replace(/\s+/g, '').replace(/[/?ㆍ·_-]/g, '').toLowerCase()
}

function resolveJudgeResultField(label: string) {
  const normalizedLabel = normalizeJudgeFieldLabel(label)
  return JUDGE_RESULT_FIELDS.find((field) =>
    field.aliases.some((alias) => normalizeJudgeFieldLabel(alias) === normalizedLabel),
  ) ?? null
}

function resolveRecommendationField(label: string) {
  const normalizedLabel = normalizeJudgeFieldLabel(label)
  return RECOMMENDATION_CARD_FIELDS.find((field) =>
    field.aliases.some((alias) => normalizeJudgeFieldLabel(alias) === normalizedLabel),
  ) ?? null
}

function cleanJudgeResultLine(line: string) {
  return line
    .trim()
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .trim()
}

function readFirstMeaningfulLine(text: string) {
  return text
    .split('\n')
    .map((line) => cleanJudgeResultLine(line))
    .find(Boolean) ?? ''
}

function inferLeftoverMenuTitle(text: string) {
  const normalized = text.replace(/\s+/g, '')

  if (/볶음면|비빔면|면/.test(normalized)) {
    return '남은 재료 볶음면 도시락'
  }

  if (/덮밥/.test(normalized)) {
    return '남은 재료 덮밥 도시락'
  }

  if (/주먹밥|김밥/.test(normalized)) {
    return '남은 재료 주먹밥 도시락'
  }

  if (/볶음밥|밥/.test(normalized)) {
    return '남은 재료 볶음밥 도시락'
  }

  return '남은 재료 활용 도시락'
}

function inferLeftoverIngredients(text: string) {
  const normalized = text.replace(/\s+/g, '')
  const candidates = [
    { label: '자투리 채소', pattern: /자투리채소|남은채소|채소/ },
    { label: '밥 또는 면', pattern: /밥|면/ },
    { label: '계란', pattern: /계란|달걀/ },
    { label: '참치캔', pattern: /참치/ },
    { label: '김치', pattern: /김치/ },
  ]

  return candidates
    .filter((candidate) => candidate.pattern.test(normalized))
    .map((candidate) => candidate.label)
    .slice(0, 4)
    .join(', ')
}

function getRecommendationDefaults(feature: AiFeature) {
  if (feature === 'leftover-ingredients') {
    return {
      title: '남은 재료 활용 도시락',
      subtitle: '남은 재료를 먼저 쓰는 도시락',
      cookTime: '약 15분',
      estimatedCost: '추가 구매 최소',
    }
  }

  return {
    title: '오늘 도시락 추천',
    subtitle: '간단하게 준비하기 좋은 도시락',
    cookTime: '약 15분',
    estimatedCost: '재료별 상이',
  }
}

function buildJudgeResultDisplay(text: string): JudgeResultDisplay | null {
  const sectionMap = new Map<string, string[]>()
  let currentField: JudgeResultField | null = null

  text.split('\n').forEach((rawLine) => {
    const line = cleanJudgeResultLine(rawLine)
    if (!line) return

    const labelMatch = line.match(/^(.{1,24}?)\s*[:：]\s*(.*)$/)
    if (labelMatch) {
      const field = resolveJudgeResultField(labelMatch[1])
      if (field) {
        currentField = field
        const value = labelMatch[2].trim()
        if (value) {
          sectionMap.set(field.key, [...(sectionMap.get(field.key) ?? []), value])
        }
        return
      }
    }

    if (currentField) {
      sectionMap.set(currentField.key, [...(sectionMap.get(currentField.key) ?? []), line])
    }
  })

  const sections = JUDGE_RESULT_FIELDS.map((field) => {
    const content = (sectionMap.get(field.key) ?? []).join('\n').trim()
    return content ? { key: field.key, title: field.title, content } : null
  }).filter((section): section is JudgeResultSection => Boolean(section))

  if (sections.length < 2) return null

  return {
    title: 'AI 구매 판단',
    subtitle: '구매에 대한 AI의 추천이에요',
    sections,
  }
}

function renderJudgeResultCard(display: JudgeResultDisplay) {
  return (
    <section className="chatbot-judge-result-card" aria-label={display.title}>
      <header className="chatbot-judge-result-card__header">
        <h3 className="chatbot-judge-result-card__title">{display.title}</h3>
        <p className="chatbot-judge-result-card__subtitle">{display.subtitle}</p>
      </header>
      <div className="chatbot-judge-result-card__sections">
        {display.sections.map((section) => (
          <article className="chatbot-judge-result-card__section" key={section.key}>
            <strong className="chatbot-judge-result-card__label">{section.title}</strong>
            <p className="chatbot-judge-result-card__content">{section.content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function buildRecommendationRecipeData(text: string, feature: AiFeature | null | undefined): RecipeData | null {
  if (!feature || !RECOMMENDATION_CARD_FEATURES.has(feature)) return null

  const sectionMap = new Map<RecommendationField['key'], string[]>()
  let currentField: RecommendationField | null = null

  text.split('\n').forEach((rawLine) => {
    const line = cleanJudgeResultLine(rawLine)
    if (!line) return

    const labelMatch = line.match(/^(.{1,24}?)\s*[:：]\s*(.*)$/)
    if (labelMatch) {
      const field = resolveRecommendationField(labelMatch[1])
      if (field) {
        currentField = field
        const value = labelMatch[2].trim()
        if (value) {
          sectionMap.set(field.key, [...(sectionMap.get(field.key) ?? []), value])
        }
        return
      }
    }

    if (currentField) {
      sectionMap.set(currentField.key, [...(sectionMap.get(currentField.key) ?? []), line])
    }
  })

  const readField = (key: RecommendationField['key']) => (sectionMap.get(key) ?? []).join('\n').trim()
  const menu = readField('menu')
  const ingredients = readField('ingredients')
  const extra = readField('extra')
  const cookTime = readField('cookTime')
  const cost = readField('cost')
  const method = readField('method')
  const saving = readField('saving')
  const reason = readField('reason')
  const defaults = getRecommendationDefaults(feature)
  const isLeftover = feature === 'leftover-ingredients'
  const fallbackMenu = isLeftover ? inferLeftoverMenuTitle(text) : ''
  const fallbackIngredients = isLeftover ? inferLeftoverIngredients(text) : ''
  const effectiveMenu = menu || fallbackMenu
  const effectiveIngredients = ingredients || fallbackIngredients

  if (!effectiveMenu && !cookTime && !method && !effectiveIngredients && !saving) return null

  const ingredientLabel = isLeftover ? '먼저 쓸 재료' : '활용 재료'
  const methodLabel = isLeftover ? '활용 방법' : '조리법'
  const fallbackReason = isLeftover ? readFirstMeaningfulLine(text) : ''

  const reasonLines = [
    reason || fallbackReason,
    effectiveIngredients ? `${ingredientLabel}: ${effectiveIngredients}` : '',
    extra ? `추가 재료: ${extra}` : '',
    method ? `${methodLabel}: ${method}` : '',
    saving ? `절약 포인트: ${saving}` : '',
  ].filter(Boolean)

  return {
    title: effectiveMenu || defaults.title,
    subtitle: effectiveIngredients ? `${effectiveIngredients} 활용 메뉴` : defaults.subtitle,
    imageUrl: defaultRecipeImage,
    cookTime: cookTime || defaults.cookTime,
    estimatedCost: cost || defaults.estimatedCost,
    reason: reasonLines.join('\n') || text.trim(),
  }
}

function SplitGreeting({ displayName }: { displayName: string }) {
  let charIndex = 0

  const renderSegment = (text: string, key: string, strong = false) => {
    const chars = Array.from(text)
    const segment = (
      <span className="chatbot-greeting__segment" key={key}>
        {chars.map((char) => {
          const delay = `${charIndex * 34}ms`
          charIndex += 1

          return (
            <span
              className="chatbot-greeting__char"
              key={`${key}-${charIndex}`}
              style={{ animationDelay: delay }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </span>
    )

    return strong ? (
      <strong className="chatbot-greeting__strong" key={`${key}-strong`}>
        {segment}
      </strong>
    ) : segment
  }

  return (
    <p
      className="chatbot-greeting chatbot-greeting--split"
      aria-label={`안녕하세요. ${displayName}님! 오늘은 무엇을 도와드릴까요?`}
    >
      <span className="chatbot-greeting__line" aria-hidden="true">
        {renderSegment('안녕하세요. ', 'hello')}
        {renderSegment(displayName, 'name', true)}
        {renderSegment('님!', 'suffix')}
      </span>
      <span className="chatbot-greeting__line" aria-hidden="true">
        {renderSegment('오늘은 무엇을 도와드릴까요?', 'question')}
      </span>
    </p>
  )
}

function summarizeAiText(text: string) {
  const normalized = text.replace(/\s+/g, '')

  if (/(영수증|총평|총지출|지출이큰항목|절약할수있는항목|장보기팁|다음장보기팁)/.test(normalized)) {
    return '영수증 분석 결과를 정리해봤어요.'
  }

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

function getUniqueSuggestionItems(items: string[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const normalized = item.trim()
    if (!normalized || seen.has(normalized)) {
      return false
    }
    seen.add(normalized)
    return true
  })
}

function getFollowupSuggestionItems(feature: AiFeature, apiSuggestions: string[] = []) {
  return getUniqueSuggestionItems([
    ...apiSuggestions,
    ...(FEATURE_FOLLOWUP_SUGGESTIONS[feature] ?? []),
    GO_TO_CHATBOT_HOME_LABEL,
  ]).slice(0, 4)
}

function withConversationSuggestions(
  messages: ChatMessage[],
  feature: AiFeature,
  apiSuggestions: string[] = [],
) {
  const items = getFollowupSuggestionItems(feature, apiSuggestions)
  const suggestionIndex = messages.findIndex((message) => message.type === 'suggestions')

  if (suggestionIndex >= 0) {
    return messages.map((message, index) => (
      index === suggestionIndex && message.type === 'suggestions'
        ? { ...message, items: getUniqueSuggestionItems([...message.items, ...items]) }
        : message
    ))
  }

  const suggestionMessage: ChatMessage = {
    id: `ai-suggestions-${Date.now()}`,
    type: 'suggestions',
    role: 'assistant',
    status: 'success',
    feature,
    source: messages[0]?.source ?? 'api',
    createdAt: new Date().toISOString(),
    items,
  }

  return [
    ...messages,
    suggestionMessage,
  ]
}

function withoutRecipeCards(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.type !== 'ai-recipe')
    .map((message) => (
      message.type === 'ai-text'
        ? { ...message, feature: undefined }
        : message
    ))
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

async function requestReceiptPhotoAnalysis(imageDataUrl: string): Promise<ChatApiResponse> {
  const analysisResult = await analyzeReceiptImage(imageDataUrl)
  const text = buildReceiptAnalysisChatText(analysisResult)
  const createdAt = new Date().toISOString()

  return {
    id: `ai-receipt-${Date.now()}`,
    feature: 'receipt-analysis',
    status: 'success',
    source: 'api',
    text,
    messages: [
      {
        id: `ai-receipt-text-${Date.now()}`,
        type: 'ai-text',
        role: 'assistant',
        status: 'success',
        feature: 'receipt-analysis',
        source: 'api',
        createdAt,
        text,
      },
    ],
    suggestions: [],
    createdAt,
  }
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

async function convertImageAssetToJpegDataUrl(imageUrl: string) {
  const image = await loadImageFromUrl(imageUrl)
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height

  for (const edge of IMAGE_EDGE_CANDIDATES) {
    const canvas = renderSourceToCanvas(image, width, height, edge)
    const jpegDataUrl = encodeCanvasToJpegWithinLimit(canvas, MAX_IMAGE_DATA_URL_LENGTH)
    if (jpegDataUrl && jpegDataUrl.length <= MAX_IMAGE_DATA_URL_LENGTH) {
      return jpegDataUrl
    }
  }

  throw new Error('예시 이미지 변환에 실패했어요. 잠시 후 다시 시도해 주세요.')
}

function ChatbotChat() {
  const [initialContext] = useState<ChatRouteContext>(getRouteContext)
  const [initialAnalysisType] = useState<AnalysisType>(() =>
    initialContext.analysisType
    ?? (initialContext.judgeMode ? 'judge' : inferAnalysisTypeFromText(initialContext.query, 'menu')),
  )
  const routeContextRef = useRef<ChatRouteContext>(initialContext)

  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도락프렌즈'
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [showCameraSheet, setShowCameraSheet] = useState(false)
  const [showPhotoPurposeSheet, setShowPhotoPurposeSheet] = useState(false)
  const [selectedPhotoPurpose, setSelectedPhotoPurpose] = useState<PhotoPurposeFeature | null>(() =>
    getPhotoPurposeFromContext(initialContext.feature, initialContext.analysisType),
  )
  const [cameraSheetFeature, setCameraSheetFeature] = useState<AiFeature | null>(initialContext.feature)
  const [showDesktopCamera, setShowDesktopCamera] = useState(false)
  const [desktopCameraError, setDesktopCameraError] = useState('')
  const [isJudgeFlow, setIsJudgeFlow] = useState(initialAnalysisType === 'judge')
  const [judgeMode, setJudgeMode] = useState<JudgeMode>(initialContext.judgeMode ?? 'text')
  const [showFridgeResultModal, setShowFridgeResultModal] = useState(false)
  const [showFridgeSavedModal, setShowFridgeSavedModal] = useState(false)
  const [fridgeDetectedIngredients, setFridgeDetectedIngredients] = useState<FridgeDetectedIngredient[]>([])
  const [savedFridgeIngredientLabels, setSavedFridgeIngredientLabels] = useState<string[]>([])
  const [fridgeResultListScroll, setFridgeResultListScroll] = useState({
    isAtTop: true,
    isAtBottom: false,
  })
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const desktopCameraStreamRef = useRef<MediaStream | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const lastJudgeSubjectRef = useRef('')
  const lastJudgeImageDataUrlRef = useRef<string | null>(null)
  const pendingPhotoSelectionRef = useRef<{ imageDataUrl: string; displayText: string } | null>(null)
  const activeFeatureRef = useRef<AiFeature | null>(initialContext.feature)
  const activeAnalysisTypeRef = useRef<AnalysisType>(initialAnalysisType)
  const hasInitializedRef = useRef(false)
  const [fridgeLoadingProgress, setFridgeLoadingProgress] = useState<{ loadingId: string | null; step: number }>({
    loadingId: null,
    step: 1,
  })
  const [dismissedFridgeLoadingId, setDismissedFridgeLoadingId] = useState<string | null>(null)
  const fridgeLoadingStartedAtRef = useRef<Record<string, number>>({})

  const fridgeLoadingOverlay = useMemo(() => getFridgeLoadingOverlay(messages), [messages])
  const activeFridgeLoadingId = fridgeLoadingOverlay?.pendingId ?? null
  const fridgeLoadingStep =
    activeFridgeLoadingId && fridgeLoadingProgress.loadingId === activeFridgeLoadingId
      ? fridgeLoadingProgress.step
      : 1
  const shouldShowFridgeLoadingModal =
    Boolean(fridgeLoadingOverlay)
    && activeFridgeLoadingId !== dismissedFridgeLoadingId
  const hasSelectedFridgeIngredients = fridgeDetectedIngredients.some((ingredient) => ingredient.selected)
  const hasScrollableFridgeResultList = fridgeDetectedIngredients.length > 5
  const savedIngredientSummary = useMemo(() => {
    if (savedFridgeIngredientLabels.length === 0) {
      return '선택한 재료 0개가 추가됐어요'
    }
    return `${savedFridgeIngredientLabels.join(',')} ${savedFridgeIngredientLabels.length}개가 추가됐어요`
  }, [savedFridgeIngredientLabels])

  const openCameraSheet = useCallback((feature?: AiFeature | null) => {
    setCameraSheetFeature(feature ?? null)
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
      const receiptImageDataUrl = options.imageDataUrl?.trim()
      const shouldUseReceiptAnalyzer = options.useApi
        && options.feature === 'receipt-analysis'
        && Boolean(receiptImageDataUrl)
      const response = shouldUseReceiptAnalyzer && receiptImageDataUrl
        ? await requestReceiptPhotoAnalysis(receiptImageDataUrl)
        : await requestAiChat({
          message: userText,
          imageDataUrl: options.imageDataUrl,
          analysisType: options.analysisType,
          feature: options.feature,
          forceMock: !options.useApi,
        })
      await ensureFridgeLoadingDuration(pendingId)
      activeFeatureRef.current = response.feature
      activeAnalysisTypeRef.current = getAnalysisTypeForFeature(response.feature)
      const baseResponseMessages = applyPendingIdToFirstAssistantMessage(response.messages, pendingId)
      const visibleResponseMessages = options.suppressRecipeCard
        ? withoutRecipeCards(baseResponseMessages)
        : baseResponseMessages
      const responseMessages = response.status === 'success'
        ? withConversationSuggestions(
          visibleResponseMessages,
          response.feature,
          response.suggestions,
        )
        : visibleResponseMessages

      setMessages((previousMessages) => {
        const pendingIndex = previousMessages.findIndex((message) => message.id === pendingId)
        if (pendingIndex === -1) return previousMessages

        const nextMessages = [...previousMessages]
        nextMessages.splice(pendingIndex, 1, ...responseMessages)
        return nextMessages
      })

      if (response.feature === 'fridge-photo-analysis' && response.status === 'success') {
        setFridgeDetectedIngredients(buildFridgeDetectedIngredientsFromText(response.text))
        setFridgeResultListScroll({ isAtTop: true, isAtBottom: false })
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

  const submitPhotoForAnalysis = useCallback((
    imageDataUrl: string,
    displayText: string,
    purposeFeature: PhotoPurposeFeature,
  ) => {
    const { analysisType, feature, judgeFlow, promptText } = getPhotoAnalysisConfig(purposeFeature)
    setSelectedPhotoPurpose(purposeFeature)
    lastJudgeImageDataUrlRef.current = imageDataUrl
    if (judgeFlow) {
      lastJudgeSubjectRef.current = displayText
      setJudgeMode('photo')
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
  }, [queueUserRequest])

  const handlePhotoPurposeSheetClose = useCallback(() => {
    pendingPhotoSelectionRef.current = null
    setShowPhotoPurposeSheet(false)
  }, [])

  const handlePhotoPurposeSelect = useCallback((purposeFeature: PhotoPurposeFeature) => {
    const pendingPhotoSelection = pendingPhotoSelectionRef.current
    pendingPhotoSelectionRef.current = null

    setSelectedPhotoPurpose(purposeFeature)
    activeFeatureRef.current = purposeFeature
    activeAnalysisTypeRef.current = getAnalysisTypeForFeature(purposeFeature)
    if (purposeFeature === 'buy-or-not') {
      setIsJudgeFlow(true)
      setJudgeMode('photo')
    } else {
      setIsJudgeFlow(false)
    }

    setShowPhotoPurposeSheet(false)
    if (!pendingPhotoSelection) {
      if (purposeFeature === 'receipt-analysis') {
        window.location.hash = '#/receipt-analysis'
        return
      }
      window.location.hash = `#/chatbot-camera?purpose=${purposeFeature}`
      return
    }

    submitPhotoForAnalysis(
      pendingPhotoSelection.imageDataUrl,
      pendingPhotoSelection.displayText,
      purposeFeature,
    )
  }, [submitPhotoForAnalysis])

  const handleDemoPhotoPurposeSelect = useCallback(async (purposeFeature: PhotoPurposeFeature) => {
    pendingPhotoSelectionRef.current = null
    setSelectedPhotoPurpose(purposeFeature)
    activeFeatureRef.current = purposeFeature
    activeAnalysisTypeRef.current = getAnalysisTypeForFeature(purposeFeature)
    setShowPhotoPurposeSheet(false)

    if (purposeFeature === 'buy-or-not') {
      setIsJudgeFlow(true)
      setJudgeMode('photo')
    } else {
      setIsJudgeFlow(false)
    }

    const displayText = purposeFeature === 'receipt-analysis'
      ? '예시 영수증 사진 첨부했어. 분석해줘.'
      : purposeFeature === 'fridge-photo-analysis'
        ? '예시 냉장고 사진 첨부했어. 분석해줘.'
        : '예시 사진 첨부했어. 살까말까 판단해줘.'

    try {
      const imageDataUrl = await convertImageAssetToJpegDataUrl(getDemoImageSrcForPurpose(purposeFeature))
      submitPhotoForAnalysis(imageDataUrl, displayText, purposeFeature)
    } catch (error) {
      const message = error instanceof Error ? error.message : '예시 이미지를 불러오지 못했어요.'
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          type: 'ai-text',
          role: 'assistant',
          status: 'error',
          feature: purposeFeature,
          source: 'api',
          createdAt: new Date().toISOString(),
          text: message,
        },
      ])
    }
  }, [submitPhotoForAnalysis])

  useEffect(() => {
    if (hasInitializedRef.current) {
      return
    }
    hasInitializedRef.current = true

    const context = routeContextRef.current
    if (context.demoPurpose) {
      const demoPurpose = context.demoPurpose

      setSelectedPhotoPurpose(demoPurpose)
      activeFeatureRef.current = demoPurpose
      activeAnalysisTypeRef.current = getAnalysisTypeForFeature(demoPurpose)

      if (demoPurpose === 'buy-or-not') {
        setIsJudgeFlow(true)
        setJudgeMode('photo')
      } else {
        setIsJudgeFlow(false)
      }

      window.setTimeout(() => {
        void handleDemoPhotoPurposeSelect(demoPurpose)
      }, 120)
      return
    }

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
      const routePhotoPurpose = getPhotoPurposeFromContext(context.feature, context.analysisType)
      const introMessages: LocalMessage[] = []

      if (context.query) {
        introMessages.push({
          id: 'route-user-open-picker',
          type: 'user',
          role: 'user',
          status: 'success',
          feature: routePhotoPurpose ?? context.feature ?? undefined,
          createdAt: new Date().toISOString(),
          text: context.query,
        })
        appendChatbotHistoryMessage(context.query, 'quick')
      }

      const introText = routePhotoPurpose === 'buy-or-not'
        ? '좋아요! 사진을 올려주면 살까말까를 바로 판단해드릴게요.'
        : routePhotoPurpose === 'fridge-photo-analysis'
          ? '좋아요! 사진을 올려주시면 냉장고 재료를 분석해드릴게요.'
          : routePhotoPurpose === 'receipt-analysis'
            ? '좋아요! 영수증 사진을 올려주시면 바로 분석해드릴게요.'
            : '좋아요! 먼저 사진을 올려주세요. 사진을 올린 뒤에 목적을 선택할 수 있어요.'

      introMessages.push({
        id: 'route-ai-open-picker',
        type: 'ai-text',
        role: 'assistant',
        status: 'success',
        feature: routePhotoPurpose ?? context.feature ?? undefined,
        createdAt: new Date().toISOString(),
        text: introText,
      })

      setMessages(introMessages)
      if (routePhotoPurpose) {
        setSelectedPhotoPurpose(routePhotoPurpose)
      }
      if (routePhotoPurpose === 'buy-or-not') {
        setIsJudgeFlow(true)
        setJudgeMode('photo')
      } else {
        setIsJudgeFlow(false)
      }

      window.setTimeout(() => {
        if (context.pick === 'camera') {
          void (async () => {
            if (shouldUseDesktopWebcam()) {
              const opened = await openDesktopCamera()
              if (!opened) {
                cameraInputRef.current?.click()
              }
              return
            }
            cameraInputRef.current?.click()
          })()
          return
        }

        if (context.pick === 'album') {
          albumInputRef.current?.click()
          return
        }

        openCameraSheet(routePhotoPurpose ?? context.feature)
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
      if (context.feature === 'buy-or-not') {
        setSelectedPhotoPurpose('buy-or-not')
      }

      if (context.openPicker) {
        window.setTimeout(() => {
          if (context.pick === 'camera') {
            void (async () => {
              if (shouldUseDesktopWebcam()) {
                const opened = await openDesktopCamera()
                if (!opened) {
                  cameraInputRef.current?.click()
                }
                return
              }
              cameraInputRef.current?.click()
            })()
            return
          }

          if (context.pick === 'album') {
            albumInputRef.current?.click()
            return
          }

          openCameraSheet(context.feature ?? 'buy-or-not')
        }, 120)
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
      suppressRecipeCard: false,
    })
  }, [handleDemoPhotoPurposeSelect, openCameraSheet, openDesktopCamera, queueUserRequest])

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
    if (!shouldShowFridgeLoadingModal || !activeFridgeLoadingId) {
      return
    }

    const timer = window.setInterval(() => {
      setFridgeLoadingProgress((previousProgress) => {
        const currentStep = previousProgress.loadingId === activeFridgeLoadingId
          ? previousProgress.step
          : 1

        if (currentStep >= FRIDGE_LOADING_STEPS.length) {
          return previousProgress.loadingId === activeFridgeLoadingId
            ? previousProgress
            : { loadingId: activeFridgeLoadingId, step: currentStep }
        }

        return { loadingId: activeFridgeLoadingId, step: currentStep + 1 }
      })
    }, FRIDGE_LOADING_STEP_INTERVAL)

    return () => {
      window.clearInterval(timer)
    }
  }, [activeFridgeLoadingId, shouldShowFridgeLoadingModal])

  const toggleFridgeIngredient = useCallback((id: string) => {
    setFridgeDetectedIngredients((previousIngredients) => previousIngredients.map((ingredient) => (
      ingredient.id === id
        ? { ...ingredient, selected: !ingredient.selected }
        : ingredient
    )))
  }, [])

  const handleFridgeResultListScroll = useCallback((event: UIEvent<HTMLUListElement>) => {
    const list = event.currentTarget
    const maxScrollTop = list.scrollHeight - list.clientHeight
    const nextScrollState = {
      isAtTop: list.scrollTop <= 1,
      isAtBottom: maxScrollTop <= 1 || list.scrollTop >= maxScrollTop - 1,
    }

    setFridgeResultListScroll((previousScrollState) => (
      previousScrollState.isAtTop === nextScrollState.isAtTop
        && previousScrollState.isAtBottom === nextScrollState.isAtBottom
        ? previousScrollState
        : nextScrollState
    ))
  }, [])

  const handleAddSelectedIngredients = useCallback(() => {
    const selectedIngredients = fridgeDetectedIngredients.filter((ingredient) => ingredient.selected)
    if (selectedIngredients.length === 0) return

    const selectedLabels = selectedIngredients.map((ingredient) => ingredient.label)
    appendChatbotFridgeIngredients(selectedLabels)
    setSavedFridgeIngredientLabels(selectedLabels)
    setFridgeDetectedIngredients((previousIngredients) => previousIngredients.map((ingredient) => ({
      ...ingredient,
      selected: false,
    })))
    setShowFridgeResultModal(false)
    setShowFridgeSavedModal(true)
  }, [fridgeDetectedIngredients])

  const addUserMessage = (text: string, source: 'input' | 'suggestion' = 'input') => {
    const shouldSuppressRecipeCard = source === 'suggestion'

    if (isJudgeFlow) {
      if (!isJudgeSuggestionText(text)) {
        lastJudgeSubjectRef.current = text
      }

      queueUserRequest(text, source === 'suggestion' ? 'quick' : 'input', {
        useApi: true,
        analysisType: 'judge',
        feature: 'buy-or-not',
        judgeFlow: true,
        requestText: buildJudgeFollowupPrompt(text, lastJudgeSubjectRef.current),
        imageDataUrl: judgeMode === 'photo' ? (lastJudgeImageDataUrlRef.current ?? undefined) : undefined,
        suppressRecipeCard: shouldSuppressRecipeCard,
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

    queueUserRequest(text, source === 'suggestion' ? 'quick' : 'input', {
      useApi: initialContext.useApi,
      analysisType: nextAnalysisType,
      feature: nextFeature,
      judgeFlow: nextJudgeFlow,
      suppressRecipeCard: shouldSuppressRecipeCard,
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
              feature: selectedPhotoPurpose ?? getPhotoPurposeFromContext(
                activeFeatureRef.current ?? initialContext.feature,
                activeAnalysisTypeRef.current,
              ) ?? undefined,
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
      const purposeFeature = selectedPhotoPurpose ?? getPhotoPurposeFromContext(
        activeFeatureRef.current ?? initialContext.feature,
        activeAnalysisTypeRef.current,
      )

      if (purposeFeature) {
        submitPhotoForAnalysis(imageDataUrl, displayText, purposeFeature)
        return
      }

      pendingPhotoSelectionRef.current = { imageDataUrl, displayText }
      setShowPhotoPurposeSheet(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : '사진 분석 중 오류가 발생했어요.'
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          type: 'ai-text',
          role: 'assistant',
          status: 'error',
          feature: selectedPhotoPurpose ?? getPhotoPurposeFromContext(
            activeFeatureRef.current ?? initialContext.feature,
            activeAnalysisTypeRef.current,
          ) ?? undefined,
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
      setSelectedPhotoPurpose('buy-or-not')
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
    const purposeFeature = selectedPhotoPurpose ?? getPhotoPurposeFromContext(
      activeFeatureRef.current ?? initialContext.feature,
      activeAnalysisTypeRef.current,
    )

    if (purposeFeature) {
      submitPhotoForAnalysis(imageDataUrl, '촬영 사진 첨부했어. 분석해줘.', purposeFeature)
      return
    }

    pendingPhotoSelectionRef.current = {
      imageDataUrl,
      displayText: '촬영 사진 첨부했어. 분석해줘.',
    }
    setShowPhotoPurposeSheet(true)
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
              <img src={xIcon} alt="" aria-hidden="true" />
            </button>
          </header>

          <div ref={messagesRef} className="chatbot-chat-messages">
            <SplitGreeting displayName={displayName} />

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

            {messages.map((msg, index) => {
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
                  <div key={msg.id} className="chatbot-msg chatbot-msg--ai chatbot-msg--ai-loading">
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className="chatbot-ai-bubble chatbot-ai-bubble--loading">
                      <span className="chatbot-ai-bubble__text chatbot-loading__text">
                        {msg.text ?? '냠냠크루가 준비 중입니다.'}
                      </span>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'ai-text') {
                const aiDisplay = getAiTextDisplay(msg.text)
                const showFullTextInBubble = msg.status !== 'error' && !msg.feature
                const judgeResultDisplay = msg.status !== 'error' && msg.feature === 'buy-or-not'
                  ? buildJudgeResultDisplay(msg.text)
                  : null
                const hasFollowingRecipe = messages.slice(index + 1).some((message) =>
                  message.type === 'ai-recipe' && message.feature === msg.feature,
                )
                const recommendationRecipe = msg.status !== 'error' && !judgeResultDisplay && !hasFollowingRecipe
                  ? buildRecommendationRecipeData(msg.text, msg.feature)
                  : null
                const bubbleText = judgeResultDisplay
                  ? 'AI가 판단한 결과에요.'
                  : msg.feature === 'receipt-analysis'
                    ? '영수증 분석 결과를 정리해봤어요.'
                  : recommendationRecipe
                    ? '도시락 추천 결과를 정리해봤어요.'
                    : showFullTextInBubble
                      ? msg.text
                      : aiDisplay.bubbleText
                const detailText = judgeResultDisplay || recommendationRecipe || showFullTextInBubble
                  ? null
                  : aiDisplay.detailText
                const stackClassName = [
                  'chatbot-ai-stack',
                  judgeResultDisplay ? 'chatbot-ai-stack--judge' : '',
                  recommendationRecipe ? 'chatbot-ai-stack--recipe' : '',
                ].filter(Boolean).join(' ')
                const messageClassName = [
                  'chatbot-msg',
                  'chatbot-msg--ai',
                  showFullTextInBubble ? 'chatbot-msg--ai-full-bubble' : '',
                ].filter(Boolean).join(' ')
                if (judgeResultDisplay) {
                  return (
                    <div key={msg.id} className="chatbot-msg chatbot-msg--ai chatbot-msg--ai-judge">
                      <div className="chatbot-ai-judge-head">
                        <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                        <div className="chatbot-ai-bubble">
                          <span className="chatbot-ai-bubble__text">
                            {renderBubbleText(bubbleText)}
                          </span>
                        </div>
                      </div>
                      <div className={stackClassName}>
                        {renderJudgeResultCard(judgeResultDisplay)}
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={msg.id} className={messageClassName}>
                    <img className="chatbot-mascot" src={chatbotMascotIcon} alt="" aria-hidden="true" />
                    <div className={stackClassName}>
                      <div className="chatbot-ai-bubble">
                        <span className="chatbot-ai-bubble__text">
                          {renderBubbleText(bubbleText)}
                        </span>
                      </div>
                      {recommendationRecipe ? <ChatbotRecipeCard recipe={recommendationRecipe} /> : null}
                      {detailText ? (
                        <div className="chatbot-ai-detail-card">
                          <p className="chatbot-ai-detail-card__text">
                            {renderBubbleText(detailText)}
                          </p>
                        </div>
                      ) : null}
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
                            window.location.hash = '#/chatbot?skipCoach=1'
                            return
                          }
                          if (item.includes('레시피 보러')) {
                            window.location.hash = '#/community?recipeId=recipe-1'
                            return
                          }
                          if (item.includes('사진') && item.includes('다시')) {
                            const purposeFeature = getPhotoPurposeFromContext(
                              msg.feature ?? activeFeatureRef.current ?? initialContext.feature,
                              msg.feature ? getAnalysisTypeForFeature(msg.feature) : activeAnalysisTypeRef.current,
                            )
                            if (purposeFeature) {
                              setSelectedPhotoPurpose(purposeFeature)
                            }
                            if (purposeFeature === 'buy-or-not') {
                              setJudgeMode('photo')
                              setIsJudgeFlow(true)
                            } else {
                              setIsJudgeFlow(false)
                            }
                            if (purposeFeature === 'receipt-analysis') {
                              window.location.hash = '#/receipt-analysis'
                              return
                            }
                            window.location.hash = `#/chatbot-camera?purpose=${purposeFeature ?? 'fridge-photo-analysis'}`
                            return
                          }
                          addUserMessage(item, 'suggestion')
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

          {showPhotoPurposeSheet ? (
            <ChatbotCameraSheet
              title="이 사진으로 무엇을 할까요?"
              actions={[
                {
                  label: '영수증 분석',
                  onClick: () => handlePhotoPurposeSelect('receipt-analysis'),
                },
                {
                  label: '냉장고 재료 추가',
                  onClick: () => handlePhotoPurposeSelect('fridge-photo-analysis'),
                },
                {
                  label: '살까말까',
                  onClick: () => handlePhotoPurposeSelect('buy-or-not'),
                },
              ]}
              onClose={handlePhotoPurposeSheetClose}
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
                  <img src={xIcon} alt="" aria-hidden="true" />
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
                    src={fridgeLoadingMascotImage}
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
                      <li
                        key={stepNumber}
                        className={`chatbot-fridge-loading__progress-item${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                      >
                        <span
                          className={`chatbot-fridge-loading__progress-dot${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                          aria-current={isActive ? 'step' : undefined}
                        >
                          {stepNumber}
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
                      <li
                        key={label}
                        className={`chatbot-fridge-loading__check-item${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                      >
                        <span className={`chatbot-fridge-loading__check-icon${isDone ? ' is-done' : ''}`}>
                          {isDone ? (
                            <img
                              className="chatbot-fridge-loading__check-icon-img"
                              src={checkIcon}
                              alt=""
                              aria-hidden="true"
                            />
                          ) : stepNumber}
                        </span>
                        <span>{label}</span>
                      </li>
                    )
                  })}
                </ol>

                <p className="chatbot-fridge-loading__hint" aria-label="잠시만 기다려 주세요...">
                  잠시만 기다려 주세요
                  <span className="chatbot-fridge-loading__dots" aria-hidden="true">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </p>
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
                  <img src={xIcon} alt="" aria-hidden="true" />
                </button>
                <h2 className="chatbot-fridge-result-modal__title">AI가 찾은 재료예요</h2>
                <p className="chatbot-fridge-result-modal__description">재료함에 추가할 항목을 확인 해주세요</p>

                <div
                  className={`chatbot-fridge-result-modal__list-wrap${hasScrollableFridgeResultList ? ' is-scrollable' : ''}${!fridgeResultListScroll.isAtTop ? ' has-top-fade' : ''}${hasScrollableFridgeResultList && !fridgeResultListScroll.isAtBottom ? ' has-bottom-fade' : ''}`}
                >
                  <ul
                    className="chatbot-fridge-result-modal__list"
                    onScroll={handleFridgeResultListScroll}
                  >
                    {fridgeDetectedIngredients.map((ingredient) => (
                      <li className="chatbot-fridge-result-modal__list-row" key={ingredient.id}>
                        <button
                          className="chatbot-fridge-result-modal__item"
                          type="button"
                          onClick={() => toggleFridgeIngredient(ingredient.id)}
                        >
                          <span
                            className={`chatbot-fridge-result-modal__check${ingredient.selected ? ' is-selected' : ''}`}
                          aria-hidden="true"
                        >
                          {ingredient.selected ? (
                            <img
                              className="chatbot-fridge-result-modal__check-img"
                              src={checkIcon}
                              alt=""
                              aria-hidden="true"
                            />
                          ) : null}
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
                </div>

                <div className="chatbot-fridge-result-modal__actions">
                  <button
                    className="chatbot-fridge-result-modal__action chatbot-fridge-result-modal__action--secondary"
                    type="button"
                    onClick={() => {
                      setShowFridgeResultModal(false)
                      window.location.hash = '#/meal-storage'
                    }}
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
                  <img src={xIcon} alt="" aria-hidden="true" />
                </button>

                <img
                  className="chatbot-fridge-saved-modal__hero"
                  src={fridgeSavedHeroImage}
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
                    onClick={() => {
                      setShowFridgeSavedModal(false)
                      window.location.hash = '#/meal-storage'
                    }}
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

          {!showCameraSheet && !showPhotoPurposeSheet && !showDesktopCamera ? (
            <section className="chatbot-bottom">
              <ChatbotInputBar
                onSubmit={addUserMessage}
                onCameraClick={() => {
                  setShowPhotoPurposeSheet(true)
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

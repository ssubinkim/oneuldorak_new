import { useState } from 'react'
import '../../styles/Tailwind.css'
import { appendChatbotHistoryMessage } from '../../components/common/aiDataHub'
import { useUserProfile } from '../../components/common/useUserProfile'
import type { AiFeature, AnalysisType } from '../../features/ai/types/ai.types'
import chatbotHeroImage from '../../components/chatbot/images/main_img.png'
import xIcon from '../../components/chatbot/images/x.svg'
import ChatbotCoachMark from '../../components/chatbot/ChatbotCoachMark'
import ChatbotCameraSheet from '../../components/chatbot/ChatbotCameraSheet'
import ChatbotInputBar from '../../components/chatbot/ChatbotInputBar'
import './Chatbot.css'

type QuickSuggestion = {
  label: string
  useApi?: boolean
  analysisType?: AnalysisType
  feature?: AiFeature
  openPicker?: boolean
  route?: 'receipt-analysis'
}

const quickSuggestions: QuickSuggestion[] = [
  { label: '냉장고 분석', useApi: true, analysisType: 'menu', feature: 'fridge-photo-analysis', openPicker: true },
  { label: '영수증 분석', route: 'receipt-analysis' },
  { label: '오늘 도시락 추천', useApi: true, analysisType: 'menu', feature: 'today-lunchbox-recommendation' },
  { label: '주간 도시락 플랜', useApi: true, analysisType: 'menu', feature: 'weekly-lunchbox-plan' },
  { label: '재료별 레시피', useApi: true, analysisType: 'menu', feature: 'ingredient-recipes' },
  { label: '오늘 추천 재료', useApi: true, analysisType: 'menu', feature: 'today-recommended-ingredients' },
  { label: '남은 재료 활용', useApi: true, analysisType: 'menu', feature: 'leftover-ingredients' },
  { label: '살까말까', useApi: true, analysisType: 'judge', feature: 'buy-or-not' },
]

function closeChatbot() {
  window.location.hash = '#/home'
}

function navigateToHash(hash: string) {
  window.location.hash = hash
}

function shouldSkipCoachMark() {
  const [, queryString = ''] = window.location.hash.split('?')
  return new URLSearchParams(queryString).get('skipCoach') === '1'
}

type JudgeMode = 'text' | 'photo'
type PhotoPurposeFeature = 'receipt-analysis' | 'fridge-photo-analysis' | 'buy-or-not'

type OpenChatOptions = {
  useApi?: boolean
  judgeMode?: JudgeMode
  openPicker?: boolean
  analysisType?: AnalysisType
  feature?: AiFeature
}

const JUDGE_TEXT_QUERY = '살까말까 고민 중이야. 오늘 도시락 기준으로 사도 될지 판단해줘.'

function Chatbot() {
  const [showCoachMark, setShowCoachMark] = useState(() => !shouldSkipCoachMark())
  const [showJudgeModeSheet, setShowJudgeModeSheet] = useState(false)
  const [showPhotoPurposeSheet, setShowPhotoPurposeSheet] = useState(false)
  const { nickname } = useUserProfile()
  const displayName = nickname?.trim() || '도락프렌즈'

  const openChatPage = (text: string, source: 'quick' | 'input', options?: OpenChatOptions) => {
    const params = new URLSearchParams()
    params.set('q', text)
    if (options?.useApi) params.set('api', '1')
    if (options?.analysisType) params.set('analysis', options.analysisType)
    if (options?.feature) params.set('feature', options.feature)
    if (options?.judgeMode) {
      params.set('judge', '1')
      params.set('mode', options.judgeMode)
    }
    if (options?.openPicker) params.set('openPicker', '1')

    appendChatbotHistoryMessage(text, source)
    navigateToHash(`#/chatbot-chat?${params.toString()}`)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setShowCoachMark(false)
    if (suggestion === '살까말까') {
      setShowJudgeModeSheet(true)
      return
    }
    const suggestionConfig = quickSuggestions.find((item) => item.label === suggestion)
    if (suggestionConfig?.route === 'receipt-analysis') {
      navigateToHash('#/receipt-analysis')
      return
    }
    if (suggestionConfig?.feature === 'fridge-photo-analysis') {
      navigateToHash('#/chatbot-camera?purpose=fridge-photo-analysis')
      return
    }
    openChatPage(suggestion, 'quick', {
      useApi: suggestionConfig?.useApi,
      analysisType: suggestionConfig?.analysisType,
      feature: suggestionConfig?.feature,
      openPicker: suggestionConfig?.openPicker,
    })
  }

  const handleSubmit = (text: string) => {
    setShowCoachMark(false)
    openChatPage(text, 'input')
  }

  const handlePhotoPurposeSelect = (purposeFeature: PhotoPurposeFeature) => {
    if (purposeFeature === 'receipt-analysis') {
      setShowPhotoPurposeSheet(false)
      navigateToHash('#/receipt-analysis')
      return
    }

    setShowPhotoPurposeSheet(false)
    navigateToHash(`#/chatbot-camera?purpose=${purposeFeature}`)
  }

  const handleJudgeByText = () => {
    setShowJudgeModeSheet(false)
    openChatPage(JUDGE_TEXT_QUERY, 'quick', {
      useApi: true,
      judgeMode: 'text',
      analysisType: 'judge',
      feature: 'buy-or-not',
    })
  }

  const handleJudgeByPhoto = () => {
    setShowJudgeModeSheet(false)
    navigateToHash('#/chatbot-camera?purpose=buy-or-not')
  }

  return (
    <div className="app-shell">
      <div className="app-screen chatbot-screen">
        <main
          className={`chatbot-page${showCoachMark ? ' chatbot-page--coachmark' : ''}`}
          aria-label="챗봇"
          onClick={() => setShowCoachMark(false)}
        >
          <header className="chatbot-topbar">
            <button className="chatbot-close" type="button" aria-label="닫기" onClick={closeChatbot}>
              <img src={xIcon} alt="" aria-hidden="true" />
            </button>
          </header>

          <section className="chatbot-content">
            <p className="chatbot-greeting">
              안녕하세요. <strong>{displayName}</strong>님!
              <br />
              오늘은 무엇을 도와드릴까요?
            </p>

            <div
              key={showCoachMark ? 'suggestions-waiting' : 'suggestions-ready'}
              className={`chatbot-suggestions${showCoachMark ? ' is-waiting' : ' is-ready'}`}
              aria-label="추천 질문"
            >
              {quickSuggestions.map(({ label }) => (
                <button
                  key={label}
                  className="chatbot-chip"
                  type="button"
                  onClick={() => handleSuggestionClick(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="chatbot-hero">
              {!showCoachMark && (
                <>
                  <p className="chatbot-hero-caption" aria-hidden="true">
                    <span className="chatbot-hero-caption__text">
                      <span className="chatbot-hero-caption__word">도시락 고민은</span>
                      <span className="chatbot-hero-caption__word">우리와</span>
                      <span className="chatbot-hero-caption__word">함께해요!</span>
                    </span>
                  </p>
                  <img src={chatbotHeroImage} alt="" aria-hidden="true" />
                </>
              )}
            </div>
          </section>

          {showCoachMark && !showJudgeModeSheet && !showPhotoPurposeSheet && (
            <ChatbotCoachMark onDismiss={() => setShowCoachMark(false)} />
          )}

          {showJudgeModeSheet && (
            <ChatbotCameraSheet
              title="어떻게 판단해볼까요?"
              takePhotoLabel="대화로 판단받기"
              selectFromAlbumLabel="사진으로 판단받기"
              onTakePhoto={handleJudgeByText}
              onSelectFromAlbum={handleJudgeByPhoto}
              onClose={() => setShowJudgeModeSheet(false)}
            />
          )}

          {showPhotoPurposeSheet && (
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
              onClose={() => setShowPhotoPurposeSheet(false)}
            />
          )}

          {!showJudgeModeSheet && !showPhotoPurposeSheet ? (
            <section className="chatbot-bottom">
              <ChatbotInputBar
                onSubmit={handleSubmit}
                onCameraClick={() => {
                  setShowCoachMark(false)
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

export default Chatbot

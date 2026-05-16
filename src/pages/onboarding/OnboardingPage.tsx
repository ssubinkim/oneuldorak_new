import { useEffect, useState } from 'react'
import OnboardingIngredientGrid from '../../components/onboarding/onboardingpage/OnboardingIngredientGrid'
import OnboardingCompleteScreen from '../../components/onboarding/onboardingpage/OnboardingCompleteScreen'
import OnboardingIntroActions from '../../components/onboarding/onboardingpage/OnboardingIntroActions'
import OnboardingIntroCopy from '../../components/onboarding/onboardingpage/OnboardingIntroCopy'
import OnboardingIntroVisual from '../../components/onboarding/onboardingpage/OnboardingIntroVisual'
import OnboardingOptionList from '../../components/onboarding/onboardingpage/OnboardingOptionList'
import OnboardingQuestionActions from '../../components/onboarding/onboardingpage/OnboardingQuestionActions'
import OnboardingQuestionBody from '../../components/onboarding/onboardingpage/OnboardingQuestionBody'
import OnboardingQuestionProgress from '../../components/onboarding/onboardingpage/OnboardingQuestionProgress'
import { initialOnboardingAnswers, onboardingQuestions } from '../../components/onboarding/onboardingpage/onboardingQuestionData'
import type { AnswerValue } from '../../components/onboarding/onboardingpage/onboardingQuestionTypes'
import { saveOnboardingAnswers } from '../../components/common/aiDataHub'
import customBlueImage from '../../components/onboarding/images/custom_blue.png'
import customBroImage from '../../components/onboarding/images/custom_bro.png'
import customCarrotImage from '../../components/onboarding/images/custom_carrot.png'
import walking01Image from '../../components/onboarding/images/walking01.gif'
import yeah02Image from '../../components/onboarding/images/yeah02.gif'
import '../../styles/Tailwind.css'
import './OnboardingPage.css'

const onboardingWarmupImages = [customCarrotImage, customBlueImage, customBroImage, walking01Image, yeah02Image]

function OnboardingPage() {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialOnboardingAnswers)
  const [isComplete, setIsComplete] = useState(false)
  const activeQuestion = activeQuestionIndex === null ? null : onboardingQuestions[activeQuestionIndex]
  const isLastQuestion = activeQuestionIndex === onboardingQuestions.length - 1

  useEffect(() => {
    if (!isComplete) return

    const homeTimer = window.setTimeout(() => {
      window.location.hash = '#/home'
    }, 1000)

    return () => {
      window.clearTimeout(homeTimer)
    }
  }, [isComplete])

  useEffect(() => {
    if (typeof window === 'undefined') return

    onboardingWarmupImages.forEach((src) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [])

  const handleGoHome = () => {
    window.location.hash = '#/home'
  }

  const handleStartQuestions = () => {
    setActiveQuestionIndex(0)
  }

  const handleSelectOption = (option: string) => {
    if (!activeQuestion) return

    if (activeQuestion.selectionType === 'multiple') {
      setAnswers((prevAnswers) => {
        const currentAnswer = prevAnswers[activeQuestion.id]
        const currentOptions = Array.isArray(currentAnswer) ? currentAnswer : []
        const nextOptions = currentOptions.includes(option)
          ? currentOptions.filter((currentOption) => currentOption !== option)
          : [...currentOptions, option]

        return {
          ...prevAnswers,
          [activeQuestion.id]: nextOptions,
        }
      })
      return
    }

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [activeQuestion.id]: option,
    }))
  }

  const handleNextQuestion = () => {
    if (activeQuestionIndex === null) return

    if (isLastQuestion) {
      saveOnboardingAnswers(answers)
      setActiveQuestionIndex(null)
      setIsComplete(true)
      return
    }

    setActiveQuestionIndex(activeQuestionIndex + 1)
  }

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex === null) return

    if (activeQuestionIndex === 0) {
      setActiveQuestionIndex(null)
      return
    }

    setActiveQuestionIndex(activeQuestionIndex - 1)
  }

  if (activeQuestion) {
    const questionIndex = activeQuestionIndex ?? 0
    const selectedAnswer = answers[activeQuestion.id]
    const isIngredientsQuestion = activeQuestion.optionLayout === 'ingredients'
    const hasSelection = Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : Boolean(selectedAnswer)
    const optionLayout = activeQuestion.optionLayout ?? 'single'

    return (
      <div className="app-shell">
        <main className="app-screen onboarding-page-screen">
          <section
            className={`onboarding-page onboarding-page--question${isIngredientsQuestion ? ' onboarding-page--ingredients' : ''}`}
            aria-label="도시락 기준 질문"
          >
            <OnboardingQuestionProgress
              current={questionIndex + 1}
              mascotType={questionIndex < 3 ? 'dorak06' : 'signup'}
              total={onboardingQuestions.length}
            />

            <OnboardingQuestionBody optionLayout={optionLayout} question={activeQuestion}>
              {isIngredientsQuestion ? (
                <OnboardingIngredientGrid
                  ingredients={activeQuestion.ingredients ?? []}
                  onSelect={handleSelectOption}
                  selectedAnswer={selectedAnswer}
                />
              ) : (
                <OnboardingOptionList
                  optionLayout={optionLayout}
                  options={activeQuestion.options ?? []}
                  onSelect={handleSelectOption}
                  selectedAnswer={selectedAnswer}
                />
              )}
            </OnboardingQuestionBody>

            <OnboardingQuestionActions
              disabled={!hasSelection}
              isIngredientsQuestion={isIngredientsQuestion}
              isFixed={true}
              nextLabel={isLastQuestion ? '완료' : '다음'}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
            />
          </section>
        </main>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="app-shell">
        <main className="app-screen onboarding-page-screen">
          <OnboardingCompleteScreen />
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="app-screen onboarding-page-screen">
        <section className="onboarding-page" aria-label="도시락 기준 설정 안내">
          <OnboardingIntroVisual />
          <OnboardingIntroCopy />
          <OnboardingIntroActions onSkip={handleGoHome} onStart={handleStartQuestions} />
        </section>
      </main>
    </div>
  )
}

export default OnboardingPage

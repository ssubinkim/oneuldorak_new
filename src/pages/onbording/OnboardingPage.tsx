import { useEffect, useState } from 'react'
import OnboardingIngredientGrid from '../../components/onbording/onboardingpage/OnboardingIngredientGrid'
import OnboardingCompleteScreen from '../../components/onbording/onboardingpage/OnboardingCompleteScreen'
import OnboardingIntroActions from '../../components/onbording/onboardingpage/OnboardingIntroActions'
import OnboardingIntroCopy from '../../components/onbording/onboardingpage/OnboardingIntroCopy'
import OnboardingIntroVisual from '../../components/onbording/onboardingpage/OnboardingIntroVisual'
import OnboardingOptionList from '../../components/onbording/onboardingpage/OnboardingOptionList'
import OnboardingQuestionActions from '../../components/onbording/onboardingpage/OnboardingQuestionActions'
import OnboardingQuestionBody from '../../components/onbording/onboardingpage/OnboardingQuestionBody'
import OnboardingQuestionProgress from '../../components/onbording/onboardingpage/OnboardingQuestionProgress'
import { initialOnboardingAnswers, onboardingQuestions } from '../../components/onbording/onboardingpage/onboardingQuestionData'
import type { AnswerValue } from '../../components/onbording/onboardingpage/onboardingQuestionTypes'
import '../../styles/Tailwind.css'
import './OnboardingPage.css'

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
    }, 2000)

    return () => {
      window.clearTimeout(homeTimer)
    }
  }, [isComplete])

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
      window.sessionStorage.setItem('oneuldorak:onboarding-answers', JSON.stringify(answers))
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
              isFixed={isIngredientsQuestion}
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

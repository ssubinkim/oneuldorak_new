import { type ReactNode } from 'react'
import type { OnboardingQuestion, OptionLayout } from './onboardingQuestionTypes'
import './OnboardingQuestionBody.css'

type OnboardingQuestionBodyProps = {
  children: ReactNode
  optionLayout: OptionLayout
  question: OnboardingQuestion
}

function OnboardingQuestionBody({ children, optionLayout, question }: OnboardingQuestionBodyProps) {
  return (
    <div className={`onboarding-question__content onboarding-question__content--${optionLayout}`}>
      <p className="onboarding-question__step">{question.step}</p>
      <h1>{question.title}</h1>
      <p className="onboarding-question__subtitle">{question.subtitle}</p>

      {question.image ? (
        <div className="onboarding-question__media">
          <img src={question.image} alt={question.imageAlt ?? ''} />
        </div>
      ) : null}

      {children}
    </div>
  )
}

export default OnboardingQuestionBody

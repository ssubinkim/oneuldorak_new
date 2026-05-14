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
    <div className={`onboarding-question__content onboarding-question__content--${optionLayout} onboarding-question__content--${question.id}`}>
<h1>
          {question.title.split('\n').flatMap((line, i, arr) =>
            i < arr.length - 1 ? [line, <br key={i} />] : [line]
          )}
        </h1>
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

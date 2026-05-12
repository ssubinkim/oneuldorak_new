export type AnswerValue = string | string[]
export type OptionLayout = 'single' | 'grid' | 'ingredients'

export type IngredientOption = {
  label: string
  icon?: string
}

export type OnboardingQuestion = {
  id: string
  step: string
  title: string
  subtitle: string
  image?: string
  imageAlt?: string
  selectionType?: 'single' | 'multiple'
  optionLayout?: OptionLayout
  options?: string[]
  ingredients?: IngredientOption[]
}

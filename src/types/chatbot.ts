export type RecipeData = {
  title: string
  subtitle: string
  imageUrl?: string
  cookTime: string
  estimatedCost: string
  reason: string
}

export type UserMessage     = { id: string; type: 'user'; text: string }
export type AiTextMessage   = { id: string; type: 'ai-text'; text: string }
export type AiRecipeMessage = { id: string; type: 'ai-recipe'; recipe: RecipeData }
export type SuggestionMessage = { id: string; type: 'suggestions'; items: string[] }

export type ChatMessage =
  | UserMessage
  | AiTextMessage
  | AiRecipeMessage
  | SuggestionMessage

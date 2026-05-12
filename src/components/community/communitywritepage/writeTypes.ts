import type { WriteTab } from './writeTab'

export type RecipeWriteData = {
  title: string
  content: string
  difficulty: number
  budget: string
  time: string
  ingredient: string
}

export type BoardWriteData = {
  category: string
  title: string
  content: string
}

export type VoteWriteData = {
  title: string
  content: string
  options: string[]
}

export type CommunityWriteFormValues = {
  recipe: RecipeWriteData
  board: BoardWriteData
  vote: VoteWriteData
}

export type CommunityWritePayload =
  | { tab: 'recipe'; data: RecipeWriteData }
  | { tab: 'board'; data: BoardWriteData }
  | { tab: 'vote'; data: VoteWriteData }

export const emptyWriteFormValues: CommunityWriteFormValues = {
  recipe: {
    title: '',
    content: '',
    difficulty: 1,
    budget: '',
    time: '',
    ingredient: '',
  },
  board: {
    category: '냉장고SOS',
    title: '',
    content: '',
  },
  vote: {
    title: '',
    content: '',
    options: ['', ''],
  },
}

export function getWritePayload(activeTab: WriteTab, values: CommunityWriteFormValues): CommunityWritePayload {
  if (activeTab === 'recipe') {
    return { tab: 'recipe', data: values.recipe }
  }

  if (activeTab === 'vote') {
    return { tab: 'vote', data: values.vote }
  }

  return { tab: 'board', data: values.board }
}

import type { WriteTab } from './writeTab'

export const MAX_VOTE_OPTION_COUNT = 5

export type CommunityMediaAttachment = {
  id: string
  kind: 'image' | 'video'
  file?: File
  url?: string
  name?: string
  size?: number
}

export type RecipeWriteData = {
  title: string
  content: string
  difficulty: number
  budget: string
  time: string
  ingredient: string
  tools: string[]
  media: CommunityMediaAttachment[]
}

export type BoardWriteData = {
  category: string
  title: string
  content: string
  media: CommunityMediaAttachment[]
}

export type VoteWriteData = {
  title: string
  content: string
  options: string[]
  duration: string
}

export function normalizeVoteOption(option: string) {
  return option.trim().toLocaleLowerCase()
}

export function getUniqueVoteOptions(options: string[]) {
  const seenOptions = new Set<string>()

  return options
    .map((option) => option.trim())
    .filter((option) => {
      const normalizedOption = normalizeVoteOption(option)

      if (!normalizedOption || seenOptions.has(normalizedOption)) {
        return false
      }

      seenOptions.add(normalizedOption)
      return true
    })
    .slice(0, MAX_VOTE_OPTION_COUNT)
}

export function hasDuplicateVoteOptions(options: string[]) {
  const filledOptions = options.map(normalizeVoteOption).filter(Boolean)

  return new Set(filledOptions).size !== filledOptions.length
}

export function hasTooManyVoteOptions(options: string[]) {
  return options.map(normalizeVoteOption).filter(Boolean).length > MAX_VOTE_OPTION_COUNT
}

export type CommunityWriteFormValues = {
  board: BoardWriteData
  vote: VoteWriteData
}

export type CommunityWritePayload =
  | { tab: 'recipe'; data: RecipeWriteData }
  | { tab: 'board'; data: BoardWriteData }
  | { tab: 'vote'; data: VoteWriteData }

export const emptyWriteFormValues: CommunityWriteFormValues = {
  board: {
    category: '냉장고SOS',
    title: '',
    content: '',
    media: [],
  },
  vote: {
    title: '',
    content: '',
    options: ['', ''],
    duration: '3일',
  },
}

export function getWritePayload(activeTab: WriteTab, values: CommunityWriteFormValues): CommunityWritePayload {
  if (activeTab === 'vote') {
    return { tab: 'vote', data: values.vote }
  }

  return { tab: 'board', data: values.board }
}

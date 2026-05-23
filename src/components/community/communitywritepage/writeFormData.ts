import type { WriteTab } from './writeTab'

export const writeTabs: { id: WriteTab; label: string }[] = [
  { id: 'board', label: '게시판' },
  { id: 'vote', label: '투표' },
]

export const boardCategories = ['냉장고SOS', '꿀팁', '추천', '질문', '고민']

export const difficultyLevels = [1, 2, 3, 4, 5]

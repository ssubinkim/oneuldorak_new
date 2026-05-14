import type { SavedRecipe } from './SavedRecipeCard'

export const SAVED_RECIPES: SavedRecipe[] = [
  {
    id: 1,
    showIcon: false,
    title: '냉동밥 볶음밥 레시피',
    savedAt: '5일 전 저장',
    target: { kind: 'recipe', id: 'recipe-1' },
  },
  {
    id: 2,
    showIcon: true,
    title: '3000원으로 만드는 도시락',
    savedAt: '2일 전 저장',
    target: { kind: 'recipe', id: 'recipe-2' },
  },
  {
    id: 3,
    showIcon: false,
    title: '깍두기 볶음밥 레시피',
    savedAt: '5일 전 저장',
    target: { kind: 'recipe', id: 'recipe-3' },
  },
  {
    id: 4,
    showIcon: false,
    title: '간단 김치볶음밥 레시피',
    savedAt: '5일 전 저장',
    target: { kind: 'recipe', id: 'recipe-1' },
  },
]

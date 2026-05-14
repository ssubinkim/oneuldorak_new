import type { SavedRecipe } from '../saved-recipe-page/SavedRecipeCard'
import type { LikePost } from './LikePostCard'

export const LIKED_POSTS: LikePost[] = [
  {
    id: 1,
    category: '꿀팁',
    showIcon: true,
    title: '식비 월 20만원으로 줄인 후기',
    savedAt: '2일 전 좋아요',
    target: { kind: 'board', id: 'free-1' },
  },
  {
    id: 2,
    category: '냉장고 SOS',
    showIcon: false,
    title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?',
    savedAt: '3일 전 좋아요',
    target: { kind: 'board', id: 'free-2' },
  },
  {
    id: 3,
    category: '고민',
    showIcon: true,
    title: '매일 도시락 싸는 거 힘들어요',
    savedAt: '3일 전 좋아요',
    target: { kind: 'board', id: 'free-4' },
  },
  {
    id: 4,
    category: '질문',
    showIcon: false,
    title: '도시락 용기 추천 부탁드려요',
    savedAt: '4일 전 좋아요',
    target: { kind: 'board', id: 'free-3' },
  },
]

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

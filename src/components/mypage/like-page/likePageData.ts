import type { SavedRecipe } from '../saved-recipe-page/SavedRecipeCard'
import type { LikePost } from './LikePostCard'

export const LIKED_POSTS: LikePost[] = [
  {
    id: 1,
    category: '꿀팁',
    showIcon: true,
    title: '식비 월 20만원으로 줄인 후기',
    savedAt: '2일 전 저장',
  },
  {
    id: 2,
    category: '냉장고 SOS',
    showIcon: false,
    title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?',
    savedAt: '3일 전 저장',
  },
  {
    id: 3,
    category: '자취',
    showIcon: true,
    title: '매일 도시락 싸는 거 힘드네요',
    savedAt: '3일 전 저장',
  },
  {
    id: 4,
    category: '추천',
    showIcon: false,
    title: '도시락 용기 추천 부탁드려요',
    savedAt: '4일 전 저장',
  },
]

export const SAVED_RECIPES: SavedRecipe[] = [
  {
    id: 1,
    showIcon: false,
    title: '냉동밥 볶음밥 레시피',
    savedAt: '5일 전 저장',
  },
  {
    id: 2,
    showIcon: true,
    title: '3000원으로 만드는 도시락',
    savedAt: '2일 전 저장',
  },
  {
    id: 3,
    showIcon: false,
    title: '냉동밥 볶음밥 레시피',
    savedAt: '5일 전 저장',
  },
  {
    id: 4,
    showIcon: false,
    title: '냉동밥 볶음밥 레시피',
    savedAt: '5일 전 저장',
  },
]

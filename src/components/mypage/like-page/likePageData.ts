import type { MypageCardTarget } from '../mypageNavigation'
import type { LikePost } from './LikePostCard'
import wednesdayMenuImg from '../../../assets/images/food_imges/wednesday_menu.png'
import todayMenuImg from '../../../assets/images/food_imges/today_menu.png'
import fridayMenuImg from '../../../assets/images/food_imges/friday_menu.png'
import saturdayMenuImg from '../../../assets/images/food_imges/saturday_menu.png'

export interface LikeRecipe {
  id: number | string
  image: string
  description: string
  title: string
  price: string
  time: string
  difficulty: string
  savedAt: string
  target?: MypageCardTarget
}

export const LIKE_RECIPES: LikeRecipe[] = [
  {
    id: 1,
    image: wednesdayMenuImg,
    description: '저렴한 재료로 든든하게',
    title: '3000원으로 만드는 도시락',
    price: '3000원',
    time: '15분',
    difficulty: '쉬움',
    savedAt: '3일 전 저장',
    target: { kind: 'recipe', id: 'recipe-2' },
  },
  {
    id: 2,
    image: todayMenuImg,
    description: '상큼하고 건강하게',
    title: '연어 샐러드 도시락',
    price: '5000원',
    time: '15분',
    difficulty: '보통',
    savedAt: '5일 전 저장',
    target: { kind: 'recipe', id: 'recipe-1' },
  },
  {
    id: 3,
    image: fridayMenuImg,
    description: '간단하지만 영양 만점',
    title: '계란 볶음밥 도시락',
    price: '2000원',
    time: '5분',
    difficulty: '쉬움',
    savedAt: '6일 전 저장',
    target: { kind: 'recipe', id: 'recipe-3' },
  },
  {
    id: 4,
    image: saturdayMenuImg,
    description: '깊은 맛의 김치 한 끼',
    title: '김치볶음밥 도시락',
    price: '2500원',
    time: '20분',
    difficulty: '보통',
    savedAt: '7일 전 저장',
    target: { kind: 'recipe', id: 'recipe-1' },
  },
]

export const LIKED_POSTS: LikePost[] = [
  {
    id: 1,
    category: '꿀팁',
    showIcon: true,
    title: '식비 월 20만원으로 줄인 후기',
    preview: '3개월 실천한 방법 공유합니다. 생각보다 어렵지 ......',
    savedAt: '3일 전 저장',
    target: { kind: 'board', id: 'free-1' },
  },
  {
    id: 2,
    category: '냉장고SOS',
    showIcon: false,
    title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?',
    preview: '냉장고를 열었더니 양배추 반 통, 계란 2개, 간장만 ......',
    savedAt: '3일 전 저장',
    target: { kind: 'board', id: 'free-2' },
  },
  {
    id: 3,
    category: '고민',
    showIcon: true,
    title: '매일 도시락 싸는 거 힘들어요',
    preview: '직장 다니면서 매일 도시락 싸는 분들 어떻게 하세요 ......',
    savedAt: '4일 전 저장',
    target: { kind: 'board', id: 'free-4' },
  },
  {
    id: 4,
    category: '질문',
    showIcon: false,
    title: '도시락 용기 추천 부탁드려요',
    preview: '지금 쓰는 용기가 너무 무거워서 가볍고 밀봉 잘 되는 ......',
    savedAt: '5일 전 저장',
    target: { kind: 'board', id: 'free-3' },
  },
]

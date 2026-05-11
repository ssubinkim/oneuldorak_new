import type { RecipeCard } from '../common/PopularRecipeSection'
import mayoRiceImage from './images/menu_1.png'
import bibimbapImage from './images/menu_2.png'
import kimchiRiceImage from './images/menu_7.png'

export const hotPosts = [
  {
    rank: 1,
    title: '다들 도시락 권태기 어떻게 이겨내시나요?',
    likes: 100,
    comments: 88,
  },
  {
    rank: 2,
    title: '일주일 먹어도 안 질리는 레시피 찾음;;',
    likes: 96,
    comments: 65,
  },
  {
    rank: 3,
    title: '식비 월 20만원으로 줄인 후기',
    likes: 65,
    comments: 52,
  },
]

export const popularRecipes: RecipeCard[] = [
  {
    id: 'r1',
    icon: '🐥',
    channel: '도시락락락',
    title: '스팸 마요 덮밥',
    likes: 452,
    image: mayoRiceImage,
  },
  {
    id: 'r2',
    icon: '🥦',
    channel: '프로집밥러',
    title: '깍두기 볶음밥',
    likes: 375,
    image: kimchiRiceImage,
  },
  {
    id: 'r3',
    icon: '🌿',
    channel: '또락이',
    title: '제철 비빔밥',
    likes: 421,
    image: bibimbapImage,
  },
]

export const dorakRankings = [
  { rank: 1, name: '도시락락락' },
  { rank: 2, name: '냉털전문가' },
  { rank: 3, name: '지쳤나요?네니오' },
]

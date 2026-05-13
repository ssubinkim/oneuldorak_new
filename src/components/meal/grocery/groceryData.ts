import {
  chiliImg,
  sosageImg,
  meatImg,
  onionImg,
  potatoImg,
  brocollyImg,
  tofuImg,
  carrotImg,
  garlicImg,
} from '../mealData'
import bibimbapImg from '../../../assets/images/food_imges/bibimbap.png'
import bulgogiImg from '../../../assets/images/food_imges/bulgogi.png'
import chamchiImg from '../../../assets/images/food_imges/chamchimayo.png'
import kimbokImg from '../../../assets/images/food_imges/kimbok.png'
import omuriceImg from '../../../assets/images/food_imges/omurice.png'
import ssoyaImg from '../../../assets/images/food_imges/ssoya.png'
import type { GroceryTab, RecommendItem, ShoppingItem, StorageRecipe } from './groceryTypes'

export const INITIAL_ITEMS: ShoppingItem[] = [
  { id: 1, name: '고추', image: chiliImg, checked: false },
  { id: 2, name: '소시지', image: sosageImg, checked: true },
  { id: 3, name: '소고기', image: meatImg, checked: true },
  { id: 4, name: '양파', image: onionImg, checked: false },
  { id: 5, name: '감자', image: potatoImg, checked: false },
  { id: 6, name: '브로콜리', image: brocollyImg, checked: false },
  { id: 7, name: '두부', image: tofuImg, checked: true },
]

export const STORAGE_RECIPES: StorageRecipe[] = [
  { id: 1, image: bibimbapImg, channel: '도시락락락', name: '비빔밥', likes: 452 },
  { id: 2, image: bulgogiImg, channel: '프로집밥러', name: '불고기 덮밥', likes: 375 },
  { id: 3, image: chamchiImg, channel: '자취요리왕', name: '참치마요 덮밥', likes: 281 },
  { id: 4, image: kimbokImg, channel: '도시락락락', name: '김치볶음밥', likes: 198 },
  { id: 5, image: omuriceImg, channel: '프로집밥러', name: '오무라이스', likes: 520 },
  { id: 6, image: ssoyaImg, channel: '자취요리왕', name: '소시지 야채볶음', likes: 344 },
]

export const STORAGE_FILTERS = ['전체', '검색', '#한식', '#일식', '#양식']

export const TAB_TITLES: Record<GroceryTab, string> = {
  shopping: '장보기 체크리스트',
  storage: '저장한 레시피 보관함',
  recommend: '저장한 레시피 기반 추천메뉴',
}

export const RECOMMEND_ITEMS: RecommendItem[] = [
  { id: 1, name: '양파', image: onionImg, recipes: '제육볶음 · 카레' },
  { id: 2, name: '당근', image: carrotImg, recipes: '볶음밥 · 카레' },
  { id: 3, name: '두부', image: tofuImg, recipes: '마파두부 · 된장찌개' },
  { id: 4, name: '마늘', image: garlicImg, recipes: '파스타 · 볶음요리' },
  { id: 5, name: '브로콜리', image: brocollyImg, recipes: '잡채 · 볶음' },
  { id: 6, name: '감자', image: potatoImg, recipes: '감자볶음 · 조림' },
]

import {
  onionImg,
  brocollyImg,
  potatoImg,
  carrotImg,
  romainImg,
  beansproutsImg,
  tofuImg,
  strawberryImg,
  garlicImg,
  appleImg,
  chiliImg,
  mangoImg,
} from '../../mealData'
import indexRedImg from '../../images/index_red.svg'
import indexYellowImg from '../../images/index_yellow.svg'
import indexGreenImg from '../../images/index_green.svg'

export type Status = 'urgent' | 'moderate' | 'plenty'
export type Category = '전체' | '과일' | '단백질' | '냉동' | '소스' | '채소'

export interface FridgeItem {
  id: number
  name: string
  image: string
  isEmoji: boolean
  days: number | null
  status: Status
  category: Category
}

export const FRIDGE_ITEMS: FridgeItem[] = [
  { id: 1, name: '딸기', image: strawberryImg, isEmoji: false, days: 5, status: 'moderate', category: '과일' },
  { id: 2, name: '마늘', image: garlicImg, isEmoji: false, days: 2, status: 'urgent', category: '채소' },
  { id: 3, name: '양파', image: onionImg, isEmoji: false, days: null, status: 'plenty', category: '채소' },
  { id: 4, name: '브로콜리', image: brocollyImg, isEmoji: false, days: 5, status: 'moderate', category: '채소' },
  { id: 5, name: '사과', image: appleImg, isEmoji: false, days: 5, status: 'moderate', category: '과일' },
  { id: 6, name: '고추', image: chiliImg, isEmoji: false, days: null, status: 'plenty', category: '채소' },
  { id: 7, name: '망고', image: mangoImg, isEmoji: false, days: 5, status: 'plenty', category: '과일' },
  { id: 8, name: '상추', image: romainImg, isEmoji: false, days: 5, status: 'moderate', category: '채소' },
  { id: 9, name: '콩나물', image: beansproutsImg, isEmoji: false, days: null, status: 'plenty', category: '채소' },
  { id: 10, name: '감자', image: potatoImg, isEmoji: false, days: 2, status: 'urgent', category: '채소' },
  { id: 11, name: '두부', image: tofuImg, isEmoji: false, days: 5, status: 'plenty', category: '채소' },
  { id: 12, name: '당근', image: carrotImg, isEmoji: false, days: 2, status: 'urgent', category: '채소' },
]

export const STATUS_INDEX: Record<Status, string> = {
  urgent: indexRedImg,
  moderate: indexYellowImg,
  plenty: indexGreenImg,
}

export const FILTERS: Category[] = ['전체', '과일', '단백질', '냉동', '소스', '채소']

export const FRIDGE_TOTAL = 9
export const URGENT_COUNT = FRIDGE_ITEMS.filter((item) => item.status === 'urgent').length
export const MODERATE_COUNT = FRIDGE_ITEMS.filter((item) => item.status === 'moderate').length
export const PLENTY_COUNT = FRIDGE_ITEMS.filter((item) => item.status === 'plenty').length
export const MENU_COUNT = 5

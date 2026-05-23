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
  sosageImg,
  tunaImg,
} from '../../mealData'
import eggImg from '../../../../assets/images/food_icon/egg.png'
import tomatoImg from '../../../../assets/images/food_icon/tomato.png'
import kimchiImg from '../../../../assets/images/food_icon/kimchi.png'
import greenOnionImg from '../../../../assets/images/food_icon/green_onion.png'
import mushroomImg from '../../../../assets/images/food_icon/mushroom.png'
import cornImg from '../../../../assets/images/food_icon/corn.png'
import indexRedImg from '../../../../assets/icons/index_red.svg'
import indexYellowImg from '../../../../assets/icons/index_yellow.svg'
import indexGreenImg from '../../../../assets/icons/index_green.svg'

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
  { id: 1,  name: '마늘',   image: garlicImg,      isEmoji: false, days: 2,    status: 'urgent',   category: '채소' },
  { id: 2,  name: '감자',   image: potatoImg,      isEmoji: false, days: 2,    status: 'urgent',   category: '채소' },
  { id: 3,  name: '당근',   image: carrotImg,      isEmoji: false, days: 2,    status: 'urgent',   category: '채소' },
  { id: 4,  name: '계란',   image: eggImg,         isEmoji: false, days: 1,    status: 'urgent',   category: '단백질' },
  { id: 5,  name: '소시지', image: sosageImg,      isEmoji: false, days: 2,    status: 'urgent',   category: '단백질' },
  { id: 6,  name: '딸기',   image: strawberryImg,  isEmoji: false, days: 5,    status: 'moderate', category: '과일' },
  { id: 7,  name: '브로콜리', image: brocollyImg,  isEmoji: false, days: 5,    status: 'moderate', category: '채소' },
  { id: 8,  name: '사과',   image: appleImg,       isEmoji: false, days: 5,    status: 'moderate', category: '과일' },
  { id: 9,  name: '상추',   image: romainImg,      isEmoji: false, days: 5,    status: 'moderate', category: '채소' },
  { id: 10, name: '두부',   image: tofuImg,        isEmoji: false, days: 4,    status: 'moderate', category: '단백질' },
  { id: 11, name: '토마토', image: tomatoImg,      isEmoji: false, days: 4,    status: 'moderate', category: '채소' },
  { id: 12, name: '양파',   image: onionImg,       isEmoji: false, days: null, status: 'plenty',   category: '채소' },
  { id: 13, name: '고추',   image: chiliImg,       isEmoji: false, days: null, status: 'plenty',   category: '채소' },
  { id: 14, name: '망고',   image: mangoImg,       isEmoji: false, days: 10,   status: 'plenty',   category: '과일' },
  { id: 15, name: '콩나물', image: beansproutsImg, isEmoji: false, days: null, status: 'plenty',   category: '채소' },
  { id: 16, name: '김치',   image: kimchiImg,      isEmoji: false, days: null, status: 'plenty',   category: '소스' },
  { id: 17, name: '대파',   image: greenOnionImg,  isEmoji: false, days: null, status: 'plenty',   category: '채소' },
  { id: 18, name: '버섯',   image: mushroomImg,    isEmoji: false, days: 8,    status: 'plenty',   category: '채소' },
  { id: 19, name: '참치캔', image: tunaImg,        isEmoji: false, days: null, status: 'moderate', category: '단백질' },
  { id: 20, name: '옥수수', image: cornImg,        isEmoji: false, days: null, status: 'plenty',   category: '채소' },
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

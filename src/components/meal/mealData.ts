import todayMenuImg from '../../pages/meal/images/today_menu.png'
import salmonImg from '../../pages/meal/images/salmon.svg'
import romainImg from '../../pages/meal/images/romain.svg'
import onionImg from '../../pages/meal/images/onion.svg'
import tunaImg from '../../pages/meal/images/tuna.svg'
import meatImg from '../../pages/meal/images/meat.svg'
import porkImg from '../../pages/meal/images/pork.svg'
import carrotImg from '../../pages/meal/images/carrot.svg'
import potatoImg from '../../pages/meal/images/potato.svg'
import garlicImg from '../../pages/meal/images/garlic.svg'
import beansproutsImg from '../../pages/meal/images/beansprouts.svg'
import brocollyImg from '../../pages/meal/images/brocolly.svg'
import chiliImg from '../../pages/meal/images/chili.svg'
import tofuImg from '../../pages/meal/images/tofu.svg'
import sosageImg from '../../pages/meal/images/sosage.svg'
import appleImg from '../../pages/meal/images/apple.svg'
import grapeImg from '../../pages/meal/images/grape.svg'
import kiwiImg from '../../pages/meal/images/kiwi.svg'
import mangoImg from '../../pages/meal/images/mango.svg'
import strawberryImg from '../../pages/meal/images/strawberry.svg'

export {
  salmonImg, romainImg, onionImg, tunaImg, meatImg, porkImg,
  carrotImg, potatoImg, garlicImg, beansproutsImg, brocollyImg,
  chiliImg, tofuImg, sosageImg, appleImg, grapeImg, kiwiImg,
  mangoImg, strawberryImg,
}

export interface MenuIngredient {
  name: string
  image: string
}

export type MealStatus = 'confirmed' | 'thinking' | 'planned'

export interface DayMenu {
  day: string
  date: number
  month: number
  status: MealStatus
  image: string | null
  name: string
  time: string | null
  description: string
  savedAmount: number
  difficulty: number
  usage: number | null
  ingredients: MenuIngredient[]
}

export const weeklyMenuData: DayMenu[] = [
  {
    day: '월', date: 1, month: 5, status: 'confirmed',
    image: todayMenuImg,
    name: '연어 샐러드', time: '15분',
    description: '상큼한 연어와 신선한 채소로 가볍고 든든하게!',
    savedAmount: 4800, difficulty: 1, usage: 90,
    ingredients: [
      { name: '연어', image: salmonImg },
      { name: '양상추', image: romainImg },
      { name: '양파', image: onionImg },
      { name: '당근', image: carrotImg },
      { name: '마늘', image: garlicImg },
    ],
  },
  {
    day: '화', date: 2, month: 5, status: 'thinking',
    image: '/images/meal/chicken-salad.jpg',
    name: '닭가슴살 샐러드', time: '15분',
    description: '담백한 닭가슴살과 신선한 채소의 건강한 조합!',
    savedAmount: 3200, difficulty: 2, usage: 40,
    ingredients: [
      { name: '닭가슴살', image: meatImg },
      { name: '양상추', image: romainImg },
      { name: '양파', image: onionImg },
      { name: '마늘', image: garlicImg },
    ],
  },
  {
    day: '수', date: 3, month: 5, status: 'planned',
    image: '/images/meal/tuna-rice-ball.jpg',
    name: '참치 주먹밥', time: '15분',
    description: '참치와 고소한 참기름이 어우러진 든든한 한끼!',
    savedAmount: 2500, difficulty: 1, usage: 100,
    ingredients: [
      { name: '참치', image: tunaImg },
      { name: '당근', image: carrotImg },
      { name: '양파', image: onionImg },
      { name: '마늘', image: garlicImg },
    ],
  },
  {
    day: '목', date: 4, month: 5, status: 'thinking',
    image: null,
    name: '고민중..', time: null,
    description: '',
    savedAmount: 0, difficulty: 0, usage: null,
    ingredients: [],
  },
  {
    day: '금', date: 5, month: 5, status: 'confirmed',
    image: '/images/meal/egg-rice.jpg',
    name: '계란밥', time: '5분',
    description: '간단하지만 영양 만점! 부드러운 계란의 고소함!',
    savedAmount: 1500, difficulty: 1, usage: null,
    ingredients: [
      { name: '당근', image: carrotImg },
      { name: '양파', image: onionImg },
      { name: '감자', image: potatoImg },
      { name: '마늘', image: garlicImg },
    ],
  },
  {
    day: '토', date: 6, month: 5, status: 'planned',
    image: '/images/meal/kimchi-fried-rice.jpg',
    name: '김치볶음밥', time: '20분',
    description: '집에 있는 재료로 뚝딱! 빨간 김치볶음밥의 깊은 맛!',
    savedAmount: 2000, difficulty: 2, usage: 90,
    ingredients: [
      { name: '고추', image: chiliImg },
      { name: '양파', image: onionImg },
      { name: '마늘', image: garlicImg },
      { name: '당근', image: carrotImg },
      { name: '돼지고기', image: porkImg },
    ],
  },
  {
    day: '일', date: 7, month: 5, status: 'planned',
    image: todayMenuImg,
    name: '연어 샐러드', time: '15분',
    description: '상큼한 연어와 신선한 채소로 가볍고 든든하게!',
    savedAmount: 4800, difficulty: 1, usage: 90,
    ingredients: [
      { name: '연어', image: salmonImg },
      { name: '양상추', image: romainImg },
      { name: '양파', image: onionImg },
      { name: '당근', image: carrotImg },
      { name: '마늘', image: garlicImg },
    ],
  },
]

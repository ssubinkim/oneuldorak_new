import todayMenuImg from '../../assets/images/food_imges/today_menu.png'
import tuesdayMenuImg from '../../assets/images/food_imges/tuesday_menu.png'
import wednesdayMenuImg from '../../assets/images/food_imges/wednesday_menu.png'
import fridayMenuImg from '../../assets/images/food_imges/friday_menu.png'
import saturdayMenuImg from '../../assets/images/food_imges/saturday_menu.png'
import salmonImg from '../../assets/images/food_icon/salmon.png'
import romainImg from '../../assets/images/food_icon/lettuce.png'
import onionImg from '../../assets/images/food_icon/onion.png'
import tunaImg from '../../assets/images/food_icon/canned_tuna.png'
import meatImg from '../../assets/images/food_icon/beef.png'
import porkImg from '../../assets/images/food_icon/pork_belly.png'
import carrotImg from '../../assets/images/food_icon/carrot.png'
import potatoImg from '../../assets/images/food_icon/potato.png'
import garlicImg from '../../assets/images/food_icon/garlic.png'
import beansproutsImg from '../../assets/images/food_icon/bean_sprouts.png'
import brocollyImg from '../../assets/images/food_icon/broccoli.png'
import chiliImg from '../../assets/images/food_icon/chili_pepper.png'
import tofuImg from '../../assets/images/food_icon/tofu.png'
import sosageImg from '../../assets/images/food_icon/sausage.png'
import appleImg from '../../assets/images/food_icon/apple.png'
import grapeImg from '../../assets/images/food_icon/grapes.png'
import kiwiImg from '../../assets/images/food_icon/kiwi.png'
import mangoImg from '../../assets/images/food_icon/mango.png'
import strawberryImg from '../../assets/images/food_icon/strawberry.png'

export {
  salmonImg, romainImg, onionImg, tunaImg, meatImg, porkImg,
  carrotImg, potatoImg, garlicImg, beansproutsImg, brocollyImg,
  chiliImg, tofuImg, sosageImg, appleImg, grapeImg, kiwiImg,
  mangoImg, strawberryImg,
}

export function getIngredientIconClassName(image: string) {
  return image === romainImg ? 'ingredient-icon--lettuce' : ''
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
  calories?: number
  ingredients: MenuIngredient[]
}

export const weeklyMenuData: DayMenu[] = [
  {
    day: '월', date: 1, month: 5, status: 'confirmed',
    image: todayMenuImg,
    name: '연어 샐러드', time: '15분',
    description: '신선함과 포만감을 한 번에 담은 데일리 샐러드.',
    savedAmount: 4800, difficulty: 1, usage: 90, calories: 270,
    ingredients: [
      { name: '연어', image: salmonImg },
      { name: '양상추', image: romainImg },
      { name: '양파', image: onionImg },
      { name: '당근', image: carrotImg },
      { name: '마늘', image: garlicImg },
    ],
  },
  {
    day: '화', date: 2, month: 5, status: 'confirmed',
    image: tuesdayMenuImg,
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
    image: wednesdayMenuImg,
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
    image: fridayMenuImg,
    name: '계란 볶음밥', time: '5분',
    description: '간단하지만 영양 만점! 부드러운 계란의 고소함!',
    savedAmount: 1500, difficulty: 1, usage: 100,
    ingredients: [
      { name: '당근', image: carrotImg },
      { name: '양파', image: onionImg },
      { name: '감자', image: potatoImg },
      { name: '마늘', image: garlicImg },
    ],
  },
  {
    day: '토', date: 6, month: 5, status: 'planned',
    image: saturdayMenuImg,
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

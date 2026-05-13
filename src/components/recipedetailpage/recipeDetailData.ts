import carrotIcon from '../../assets/images/food_icon/carrot.svg'
import chiliPepperIcon from '../../assets/images/food_icon/chili_pepper.svg'
import eggIcon from '../../assets/images/food_icon/egg.svg'
import garlicIcon from '../../assets/images/food_icon/garlic.svg'
import greenOnionIcon from '../../assets/images/food_icon/green_onion.svg'
import bulgogiImage from '../meal/images/bulgogi.png'
import tunaMayoImage from '../meal/images/chamchimayo.png'
import kimchiRiceImage from '../meal/images/kimbok.png'

export type RecipeDetail = {
  title: string
  author: string
  date: string
  description: string
  time: string
  budget: string
  level: number
  likes: number
  comments: number
  saves: number
}

export type Ingredient = {
  name: string
  icon: string
}

export type RecipeComment = {
  user: string
  date: string
  text: string
}

export type SimilarRecipe = {
  channel: string
  title: string
  likes: number
  image: string
}

const recipeDetails: Record<string, RecipeDetail> = {
  'recipe-1': {
    title: '5분 완성 간단 깍두기 볶음밥',
    author: '프로집밥러',
    date: '26.05.11',
    description: '간단한 재료로 빠르고 든든하게 만들 수 있는 도시락이에요. 깍두기 김치만 있으면 뚝딱!',
    time: '15분',
    budget: '3,000원 이하',
    level: 1,
    likes: 375,
    comments: 12,
    saves: 24,
  },
  'recipe-2': {
    title: '5분 완성 간단 깍두기 볶음밥',
    author: '프로집밥러',
    date: '26.05.11',
    description: '간단한 재료로 빠르고 든든하게 만들 수 있는 도시락이에요. 깍두기 김치만 있으면 뚝딱!',
    time: '15분',
    budget: '3,000원 이하',
    level: 1,
    likes: 375,
    comments: 12,
    saves: 24,
  },
  'recipe-3': {
    title: '5분 완성 간단 깍두기 볶음밥',
    author: '프로집밥러',
    date: '26.05.11',
    description: '남은 김치와 밥으로 금방 만드는 든든한 한 끼예요. 바쁜 아침 도시락으로 좋아요.',
    time: '12분',
    budget: '3,000원 이하',
    level: 1,
    likes: 421,
    comments: 16,
    saves: 31,
  },
}

const defaultRecipe = recipeDetails['recipe-1']

export const recipeHeroImage = kimchiRiceImage
export const stepPlaceholderIcon = carrotIcon

export function getRecipeDetail(recipeId: string | null) {
  return recipeId ? recipeDetails[recipeId] ?? defaultRecipe : defaultRecipe
}

export const ingredients: Ingredient[] = [
  { name: '밥 1공기', icon: carrotIcon },
  { name: '김치 1/2컵', icon: chiliPepperIcon },
  { name: '참기름 1큰술', icon: garlicIcon },
  { name: '계란 1개', icon: eggIcon },
  { name: '김가루 약간', icon: greenOnionIcon },
]

export const cookingTools = ['프라이팬', '뒤집개', '식가위']

export const cookingSteps = [
  '도마랑 칼 쓰기 귀찮으니까 깍두기를 식가위로 대충 작게 잘라줍니다. 그리고 프라이팬에 참기름을 한 스푼 두르고 자른 깍두기를 가볍게 볶습니다.',
  '깍두기 색이 살짝 연해지면 밥을 넣고 같이 볶아요. 여기서 밥은 햇반이나 올리고당을 1/4스푼 넣으면 더 맛있어요.',
  '밥을 한쪽으로 치우고 계란프라이를 만듭니다.',
  '볶음밥을 먼저 담고 계란을 올립니다. 김가루를 뿌리면 더 맛있어요.',
]

export const recipeComments: RecipeComment[] = [
  { user: '요리왕', date: '2026.05.11', text: '진짜 간단해보이는데 맛있을 것 같아요!' },
  { user: '도시락러버', date: '2026.05.11', text: '참기름 대신 들기름이나 다른 기름 써도 되나요?' },
  { user: '집약왕', date: '2026.05.11', text: '내일 당장 해먹는다,' },
]

export const similarRecipes: SimilarRecipe[] = [
  { channel: '도시락닥닥', title: '스팸 마요 덮밥', likes: 452, image: tunaMayoImage },
  { channel: '프로집밥러', title: '깍두기 볶음밥', likes: 375, image: kimchiRiceImage },
  { channel: '온다락', title: '제육 샐러드', likes: 421, image: bulgogiImage },
]

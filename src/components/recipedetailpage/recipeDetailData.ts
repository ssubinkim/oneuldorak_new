import carrotIcon from '../../assets/images/food_icon/carrot.png'
import chiliPepperIcon from '../../assets/images/food_icon/chili_pepper.png'
import eggIcon from '../../assets/images/food_icon/egg.png'
import garlicIcon from '../../assets/images/food_icon/garlic.png'
import greenOnionIcon from '../../assets/images/food_icon/green_onion.png'
import bulgogiImage from '../../assets/images/food_imges/bulgogi.png'
import tunaMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import type { CommunityMediaAttachment } from '../community/communitywritepage/writeTypes'
import { ingredientOptions } from '../onboarding/onboardingpage/onboardingQuestionData'

export type RecipeId = 'recipe-1' | 'recipe-2' | 'recipe-3'

export type RecipeStats = {
  likeCount: number
  commentCount: number
  saveCount: number
}

export type RecipeMeta = {
  authorName: string
  authorId?: string
  publishedOn: string
}

export type RecipeCookInfo = {
  durationMinutes: number
  budgetLabel: string
  difficultyLevel: number
}

export type RecipeDetail = {
  id: string
  title: string
  summary: string
  meta: RecipeMeta
  cook: RecipeCookInfo
  stats: RecipeStats
  ingredients?: Ingredient[]
  tools?: CookingTool[]
  media?: CommunityMediaAttachment[]
}

export type Ingredient = {
  id: string
  name: string
  quantity: string
  icon: string
}

export type CookingTool = {
  id: string
  label: string
}

export type CookingStep = {
  id: number
  description: string
}

export type RecipeComment = {
  id: string
  authorName: string
  authorId?: string
  publishedOn: string
  content: string
}

export type SimilarRecipe = {
  id: string
  sourceChannel: string
  title: string
  likeCount: number
  image: string
}

const recipeDetails: Record<RecipeId, RecipeDetail> = {
  'recipe-1': {
    id: 'recipe-1',
    title: '5분 완성 간단 깍두기 볶음밥',
    summary: '간단한 재료로 빠르고 든든하게 만들 수 있는 도시락이에요. 깍두기 김치만 있으면 뚝딱!',
    meta: {
      authorName: '프로집밥러',
      publishedOn: '2026.05.11',
    },
    cook: {
      durationMinutes: 15,
      budgetLabel: '3,000원 이하',
      difficultyLevel: 1,
    },
    stats: {
      likeCount: 375,
      commentCount: 12,
      saveCount: 24,
    },
  },
  'recipe-2': {
    id: 'recipe-2',
    title: '5분 완성 간단 깍두기 볶음밥',
    summary: '간단한 재료로 빠르고 든든하게 만들 수 있는 도시락이에요. 깍두기 김치만 있으면 뚝딱!',
    meta: {
      authorName: '프로집밥러',
      publishedOn: '2026.05.11',
    },
    cook: {
      durationMinutes: 15,
      budgetLabel: '3,000원 이하',
      difficultyLevel: 1,
    },
    stats: {
      likeCount: 375,
      commentCount: 12,
      saveCount: 24,
    },
  },
  'recipe-3': {
    id: 'recipe-3',
    title: '5분 완성 간단 깍두기 볶음밥',
    summary: '남은 김치와 밥으로 금방 만드는 든든한 한 끼예요. 바쁜 아침 도시락으로 좋아요.',
    meta: {
      authorName: '프로집밥러',
      publishedOn: '2026.05.11',
    },
    cook: {
      durationMinutes: 12,
      budgetLabel: '3,000원 이하',
      difficultyLevel: 1,
    },
    stats: {
      likeCount: 421,
      commentCount: 16,
      saveCount: 31,
    },
  },
}

const defaultRecipe = recipeDetails['recipe-1']

export const recipeHeroImage = kimchiRiceImage
export const stepPlaceholderIcon = carrotIcon

function isRecipeId(value: string): value is RecipeId {
  return value in recipeDetails
}

export function getRecipeDetail(recipeId: string | null) {
  return recipeId && isRecipeId(recipeId) ? recipeDetails[recipeId] : defaultRecipe
}

export const ingredients: Ingredient[] = [
  { id: 'rice', name: '밥', quantity: '1공기', icon: carrotIcon },
  { id: 'kimchi', name: '김치', quantity: '1/2컵', icon: chiliPepperIcon },
  { id: 'sesame-oil', name: '참기름', quantity: '1큰술', icon: garlicIcon },
  { id: 'egg', name: '계란', quantity: '1개', icon: eggIcon },
  { id: 'seaweed-flakes', name: '김가루', quantity: '약간', icon: greenOnionIcon },
]

function createIngredientId(name: string, index: number) {
  return `user-ingredient-${index}-${name.replace(/\s+/g, '-')}`
}

export function getRecipeIngredientsFromText(value: string): Ingredient[] {
  return value
    .split(',')
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
    .map((name, index) => {
      const matchedIngredient = ingredientOptions.find((ingredient) => ingredient.label === name)

      return {
        id: createIngredientId(name, index),
        name,
        quantity: '',
        icon: matchedIngredient?.icon ?? carrotIcon,
      }
    })
}

export const cookingTools: CookingTool[] = [
  { id: 'frying-pan', label: '프라이팬' },
  { id: 'spatula', label: '뒤집개' },
  { id: 'kitchen-scissors', label: '식가위' },
]

export const cookingSteps: CookingStep[] = [
  {
    id: 1,
    description:
      '도마랑 칼 쓰기 귀찮으니까 깍두기를 식가위로 대충 작게 잘라줍니다. 그리고 프라이팬에 참기름을 한 스푼 두르고 자른 깍두기를 가볍게 볶습니다.',
  },
  {
    id: 2,
    description:
      '깍두기 색이 살짝 연해지면 밥을 넣고 같이 볶아요. 여기서 밥은 햇반이나 올리고당을 1/4스푼 넣으면 더 맛있어요.',
  },
  {
    id: 3,
    description: '밥을 한쪽으로 치우고 계란프라이를 만듭니다.',
  },
  {
    id: 4,
    description: '볶음밥을 먼저 담고 계란을 올립니다. 김가루를 뿌리면 더 맛있어요.',
  },
]

export const recipeComments: RecipeComment[] = [
  {
    id: 'comment-1',
    authorName: '요리왕',
    publishedOn: '2026.05.11',
    content: '진짜 간단해보이는데 맛있을 것 같아요!',
  },
  {
    id: 'comment-2',
    authorName: '도시락러버',
    publishedOn: '2026.05.11',
    content: '참기름 대신 들기름이나 다른 기름 써도 되나요?',
  },
  {
    id: 'comment-3',
    authorName: '집약왕',
    publishedOn: '2026.05.11',
    content: '내일 당장 해먹는다,',
  },
]

export const similarRecipes: SimilarRecipe[] = [
  { id: 'similar-1', sourceChannel: '도시락닥닥', title: '스팸 마요 덮밥', likeCount: 452, image: tunaMayoImage },
  { id: 'similar-2', sourceChannel: '프로집밥러', title: '깍두기 볶음밥', likeCount: 375, image: kimchiRiceImage },
  { id: 'similar-3', sourceChannel: '온다락', title: '제육 샐러드', likeCount: 421, image: bulgogiImage },
]

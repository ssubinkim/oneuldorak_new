import type { RecipeCard } from '../common/PopularRecipeSection'
import mayoRiceImage from '../../../assets/images/food_imges/chamchimayo.png'
import bibimbapImage from '../../../assets/images/food_imges/bibimbap.png'
import kimchiRiceImage from '../../../assets/images/food_imges/kimbok.png'
import curryRiceImage from '../../../assets/images/food_imges/omurice.png'
import riceBowlImage from '../../../assets/images/food_imges/today_menu.png'
import eggFoodImage from '../../../assets/images/food_imges/food_1.png'
import panFoodImage from '../../../assets/images/food_imges/food_2.png'
import sandwichFoodImage from '../../../assets/images/food_imges/food_3.png'
import spamMayoVideo from '../../../assets/food_video/video_sp.mp4'
import kimchiRiceVideo from '../../../assets/food_video/video_kim.mp4'
import eggRiceVideo from '../../../assets/food_video/video_rice.mp4'
import curryRiceVideo from '../../../assets/food_video/video_ca.mp4'
import riceBowlVideo from '../../../assets/food_video/food_rice.mp4'
import foodEggVideo from '../../../assets/food_video/video_egg.mp4'
import foodPanVideo from '../../../assets/food_video/video_pan.MP4'
import foodSandwichVideo from '../../../assets/food_video/video_sandwich.mp4'

export const hotPosts = [
  { id: 'hot-1', rank: 1, title: '도시락 싸기 전후 식비 비교해봤어요', likes: 100, comments: 88 },
  { id: 'hot-2', rank: 2, title: '오늘의 도시락 대실패 인증합니다', likes: 96, comments: 65 },
  { id: 'hot-3', rank: 3, title: '저는 일요일 밤에 3일치만 준비해요', likes: 65, comments: 52 },
]

export const popularRecipes: RecipeCard[] = [
  {
    id: 'r1',
    icon: '🐥',
    channel: '수진레전드',
    title: '스파게티',
    likes: 452,
    image: mayoRiceImage,
    video: spamMayoVideo,
  },
  {
    id: 'r2',
    icon: '🍳',
    channel: '오세훈 잘생김',
    title: '유부초밥',
    likes: 421,
    image: bibimbapImage,
    video: eggRiceVideo,
  },
  {
    id: 'r3',
    icon: '🌶️',
    channel: '두비두밥',
    title: '김치 볶음밥',
    likes: 375,
    image: kimchiRiceImage,
    video: kimchiRiceVideo,
  },
  {
    id: 'r4',
    icon: '🍛',
    channel: '송송송송 막시무스',
    title: '카레 라이스',
    likes: 398,
    image: curryRiceImage,
    video: curryRiceVideo,
  },
  {
    id: 'r5',
    icon: '🍚',
    channel: '쪼세 마리',
    title: '햄 볶음밥',
    likes: 344,
    image: riceBowlImage,
    video: riceBowlVideo,
  },
  {
    id: 'r6',
    icon: '도락',
    channel: '우석 부인',
    title: '에그타르트',
    likes: 318,
    image: eggFoodImage,
    video: foodEggVideo,
  },
  {
    id: 'r7',
    icon: '도락',
    channel: '디저트 킬러',
    title: '팬케이크',
    likes: 302,
    image: panFoodImage,
    video: foodPanVideo,
  },
  {
    id: 'r8',
    icon: '도락',
    channel: '먹먹한 먹보',
    title: '샌드위치',
    likes: 296,
    image: sandwichFoodImage,
    video: foodSandwichVideo,
  },
]

export const dorakRankings = [
  { rank: 1, name: '도시락락락', likes: 88 },
  { rank: 2, name: '냉털전문가', likes: 72 },
  { rank: 3, name: '도락쿵야', likes: 45 },
]

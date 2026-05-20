import spamMayoVideo from '../../assets/food_video/video_sp.mp4'
import kimchiRiceVideo from '../../assets/food_video/video_kim.mp4'
import eggRiceVideo from '../../assets/food_video/video_rice.mp4'
import curryRiceVideo from '../../assets/food_video/video_ca.mp4'
import riceBowlVideo from '../../assets/food_video/food_rice.mp4'
import spamMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import omurice from '../../assets/images/food_imges/omurice.png'
import todayMenu from '../../assets/images/food_imges/today_menu.png'
import RecipeVideoCarousel from './RecipeVideoCarousel'
import type { VideoRecipe } from './RecipeVideoCard'
import './WeeklyRecipeVideoSection.css'

const videoRecipes: VideoRecipe[] = [
  {
    id: 'vv-1',
    title: '참치 마요 덮밥',
    price: '5,000원',
    time: '20분',
    difficulty: '쉬움',
    likes: 452,
    video: spamMayoVideo,
    poster: spamMayoImage,
  },
  {
    id: 'vv-2',
    title: '김치볶음밥 도시락',
    price: '3,000원',
    time: '15분',
    difficulty: '쉬움',
    likes: 380,
    video: kimchiRiceVideo,
    poster: kimchiRiceImage,
  },
  {
    id: 'vv-3',
    title: '한 그릇 비빔밥',
    price: '5,000원',
    time: '20분',
    difficulty: '보통',
    likes: 320,
    video: eggRiceVideo,
    poster: bibimbapImage,
  },
  {
    id: 'vv-4',
    title: '카레 오므라이스',
    price: '6,000원',
    time: '25분',
    difficulty: '보통',
    likes: 298,
    video: curryRiceVideo,
    poster: omurice,
  },
  {
    id: 'vv-5',
    title: '닭가슴살 샐러드 볼',
    price: '7,000원',
    time: '30분',
    difficulty: '쉬움',
    likes: 275,
    video: riceBowlVideo,
    poster: todayMenu,
  },
]

function WeeklyRecipeVideoSection() {
  return (
    <section className="weekly-video-section" aria-labelledby="weeklyVideoTitle">
      <div className="weekly-video-section__header">
        <h2 id="weeklyVideoTitle" className="weekly-video-section__title">이번주 추천레시피</h2>
      </div>
      <RecipeVideoCarousel recipes={videoRecipes} />
    </section>
  )
}

export default WeeklyRecipeVideoSection

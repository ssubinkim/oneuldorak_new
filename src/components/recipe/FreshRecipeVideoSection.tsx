import eggVideo from '../../assets/food_video/video_egg.mp4'
import panVideo from '../../assets/food_video/video_pan.MP4'
import sandwichVideo from '../../assets/food_video/video_sandwich.mp4'
import kimchiVideo from '../../assets/food_video/video_kim.mp4'
import riceVideo from '../../assets/food_video/video_rice.mp4'
import food1Image from './images/food_1.png'
import food2Image from './images/food_2.png'
import food3Image from './images/food_3.png'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import bibimbapImage from '../../assets/images/food_imges/bibimbap.png'
import RecipeVideoFanCarousel from './RecipeVideoFanCarousel'
import type { VideoRecipe } from './RecipeVideoCard'

const freshRecipes: VideoRecipe[] = [
  { id: 'fr-1', title: '3가지 재료로 간단하게 만든\n에그타르트', price: '2,000원', time: '10분', difficulty: '쉬움', likes: 512, video: eggVideo, poster: food1Image, recipeId: 'recipe-1' },
  { id: 'fr-2', title: '집에서 피크닉 분위기 내기', price: '4,000원', time: '15분', difficulty: '쉬움', likes: 438, video: panVideo, poster: food2Image, recipeId: 'recipe-2' },
  { id: 'fr-3', title: '훈제연어 샌드위치', price: '6,000원', time: '15분', difficulty: '보통', likes: 391, video: sandwichVideo, poster: food3Image, recipeId: 'recipe-3' },
  { id: 'fr-4', title: '김치볶음밥 한 그릇', price: '3,000원', time: '12분', difficulty: '쉬움', likes: 356, video: kimchiVideo, poster: kimchiRiceImage, recipeId: 'recipe-1' },
  { id: 'fr-5', title: '아침에 간단히 만드는 유부초밥', price: '2,500원', time: '10분', difficulty: '쉬움', likes: 314, video: riceVideo, poster: bibimbapImage, recipeId: 'recipe-2' },
]

type Props = { onOpenDetail: (recipeId: string) => void }

function FreshRecipeVideoSection({ onOpenDetail }: Props) {
  return (
    <section className="weekly-video-section fresh-video-section" aria-labelledby="freshVideoTitle">
      <div className="weekly-video-section__header">
        <h2 id="freshVideoTitle" className="weekly-video-section__title">따끈따끈 신상 레시피</h2>
      </div>
      <RecipeVideoFanCarousel recipes={freshRecipes} onOpenDetail={onOpenDetail} />
    </section>
  )
}

export default FreshRecipeVideoSection

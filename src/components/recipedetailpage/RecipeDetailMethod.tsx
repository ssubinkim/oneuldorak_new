import type { CookingStep } from './recipeDetailData'
import blueMascotIcon from '../../assets/food_mascot/blue_mascot.png'
import broMascotIcon from '../../assets/food_mascot/bro_mascot.png'
import carrotMascotIcon from '../../assets/food_mascot/carrot_mascot.png'
import eggMascotIcon from '../../assets/food_mascot/egg_mascot.png'
import strawMascotIcon from '../../assets/food_mascot/straw_mascot.png'
import recipes1 from '../community/recipepage/images/recipes1.png'
import recipes2 from '../community/recipepage/images/recipes2.png'
import recipes3 from '../community/recipepage/images/recipes3.png'
import recipes4 from '../community/recipepage/images/recipes4.png'

const stepImages = [recipes1, recipes2, recipes3, recipes4]

type RecipeDetailMethodProps = {
  heroImage: string
  videoUrl?: string
  videoLabel?: string
  stepIcon: string
  steps: CookingStep[]
}

const videoPlayMascotIcons = [
  blueMascotIcon,
  broMascotIcon,
  carrotMascotIcon,
  eggMascotIcon,
  strawMascotIcon,
]

function getMascotIcon(seed: string) {
  const seedValue = seed
    .split('')
    .reduce((sum, character, index) => sum + character.charCodeAt(0) * (index + 1), 0)

  return videoPlayMascotIcons[seedValue % videoPlayMascotIcons.length]
}

function RecipeDetailMethod({ heroImage, videoUrl, videoLabel, stepIcon, steps }: RecipeDetailMethodProps) {
  const videoPlayMascot = getMascotIcon(heroImage)

  return (
    <section className="recipe-detail-section recipe-detail-method">
      <h2>조리 방법</h2>

      {videoUrl ? (
        <div className="recipe-detail-video recipe-detail-video--player">
          <video src={videoUrl} controls playsInline poster={heroImage} aria-label={videoLabel ?? '조리 영상'} />
        </div>
      ) : (
        <button type="button" className="recipe-detail-video" aria-label="숏츠로 먼저 보기">
          <img src={heroImage} alt="" aria-hidden="true" />
          <span className="recipe-detail-video__play" aria-hidden="true">
            <img src={videoPlayMascot} alt="" />
          </span>
          <span>숏츠로 먼저 보기</span>
        </button>
      )}

      <div className="recipe-detail-step-list">
        {steps.map((step, index) => (
          <article className="recipe-detail-step" key={step.id}>
            <div className="recipe-detail-step__copy">
              <span>{index + 1}</span>
              <p>{step.description}</p>
            </div>
            <div className="recipe-detail-step__image" aria-hidden="true">
              <img src={stepImages[index] ?? stepIcon} alt="" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecipeDetailMethod

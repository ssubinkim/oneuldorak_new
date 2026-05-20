import heartIcon from '../../../assets/icons/heart.svg'
import blueMascotIcon from '../../../assets/food_mascot/blue_mascot.svg'
import broMascotIcon from '../../../assets/food_mascot/bro_mascot.svg'
import carrotMascotIcon from '../../../assets/food_mascot/carrot_mascot.svg'
import eggMascotIcon from '../../../assets/food_mascot/egg_mascot.svg'
import strawMascotIcon from '../../../assets/food_mascot/straw_mascot.svg'
import { ArrowRightIcon } from '../../common/ui/ArrowRightIcon'
import './PopularRecipeSection.css'

export type RecipeCard = {
  id: string
  icon: string
  channel: string
  title: string
  likes: number
  image: string
  video?: string
}

type PopularRecipeSectionProps = {
  recipes: RecipeCard[]
  showMore?: boolean
  title?: string
}

const mascotIcons = [
  blueMascotIcon,
  broMascotIcon,
  carrotMascotIcon,
  eggMascotIcon,
  strawMascotIcon,
]

function getRandomMascotIcon(seed: string) {
  const seedValue = seed
    .split('')
    .reduce((sum, character, index) => sum + character.charCodeAt(0) * (index + 1), 0)

  return mascotIcons[seedValue % mascotIcons.length]
}

function PopularRecipeSection({ recipes, showMore = true, title = '인기 레시피' }: PopularRecipeSectionProps) {
  return (
    <section className="recipe-section">
      <div className="recipe-section__header">
        <h2>{title}</h2>
        {showMore && (
          <button type="button" className="recipe-section__more">
            더보기 <ArrowRightIcon />
          </button>
        )}
      </div>

      <div className="recipe-section__scroll">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="popular-recipe-card">
            {recipe.video ? (
              <video
                className="popular-recipe-card__video"
                src={recipe.video}
                poster={recipe.image}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            ) : (
              <img className="popular-recipe-card__image" src={recipe.image} alt={recipe.title} />
            )}
            <div className="popular-recipe-card__overlay">
              <div className="popular-recipe-card__meta">
                <span className="popular-recipe-card__meta-mascot" aria-hidden="true">
                  <img src={getRandomMascotIcon(recipe.id)} alt="" />
                </span>
                <span className="popular-recipe-card__meta-channel">{recipe.channel}</span>
              </div>
              <div className="popular-recipe-card__title-row">
                <h3 className="popular-recipe-card__title">{recipe.title}</h3>
                <span className="popular-recipe-card__likes">
                  <img className="popular-recipe-card__heart-icon" src={heartIcon} alt="" aria-hidden="true" />
                  {recipe.likes}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PopularRecipeSection

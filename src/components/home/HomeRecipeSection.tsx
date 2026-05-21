import broThinkIcon from '../../assets/food_mascot/bro_think.png'
import eggThinkIcon from '../../assets/food_mascot/egg_think.png'
import heartIcon from '../../assets/icons/heart.svg'
import kimchiRiceImage from '../../assets/images/food_imges/kimbok.png'
import spamMayoImage from '../../assets/images/food_imges/chamchimayo.png'
import bannerImage from './images/banner.png'
import { ArrowRightIcon } from '../common/ui/ArrowRightIcon'
import './HomeRecipeSection.css'

type HomeRecipeCard = {
  id: string
  channel: string
  title: string
  likes: number
  image: string
  icon: string
  size: 'wide' | 'small'
}

const recipes: HomeRecipeCard[] = [
  {
    id: 'recipe-banner',
    channel: '도시락락락',
    title: '스팸 마요 덮밥',
    likes: 452,
    image: bannerImage,
    icon: eggThinkIcon,
    size: 'wide',
  },
  {
    id: 'recipe-kimchi-rice',
    channel: '프로집밥러',
    title: '깍두기 볶음밥',
    likes: 375,
    image: kimchiRiceImage,
    icon: broThinkIcon,
    size: 'small',
  },
  {
    id: 'recipe-spam-mayo',
    channel: '도시락락락',
    title: '스팸 마요 덮밥',
    likes: 452,
    image: spamMayoImage,
    icon: eggThinkIcon,
    size: 'small',
  },
]

function HomeRecipeCardItem({ recipe }: { recipe: HomeRecipeCard }) {
  const isWide = recipe.size === 'wide'

  return (
    <article className={`home-recipe-card home-recipe-card--${recipe.size}`}>
      <img
        className="home-recipe-card__image"
        src={recipe.image}
        alt={recipe.title}
        width={isWide ? 360 : 172}
        height={isWide ? 160 : 200}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      <div className="home-recipe-card__overlay">
        <div className="home-recipe-card__bottom">
          <div className="home-recipe-card__text">
            <p className="home-recipe-card__channel">
              <span className="home-recipe-card__mascot" aria-hidden="true">
                <img className="home-recipe-card__mascot-image" src={recipe.icon} alt="" width={14} height={14} loading="lazy" decoding="async" fetchPriority="low" />
              </span>
              {recipe.channel}
            </p>
            <h3 className="home-recipe-card__title">{recipe.title}</h3>
          </div>
          <span className="home-recipe-card__likes">
            <img className="home-recipe-card__heart-icon" src={heartIcon} alt="" aria-hidden="true" width={12} height={11} loading="lazy" decoding="async" fetchPriority="low" />
            {recipe.likes}
          </span>
        </div>
      </div>
    </article>
  )
}

function HomeRecipeSection() {
  return (
    <section className="home-recipe-section font-pretendard-variable font-line-height-default font-letter-spacing-default" aria-labelledby="recipeTitle">
      <div className="home-recipe-section__header">
        <div>
          <h2 id="recipeTitle">
            도락이들의
            <br />
            도시락 모음.zip
          </h2>
          <p>제일 많이 본 인기있는 레시피 모음</p>
        </div>
        <a href="#/recipe" onClick={(e) => { e.preventDefault(); window.location.hash = '#/recipe' }}>더보기 <ArrowRightIcon /></a>
      </div>

      <div className="home-recipe-section__grid">
        {recipes.map((recipe) => (
          <HomeRecipeCardItem recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </section>
  )
}

export default HomeRecipeSection

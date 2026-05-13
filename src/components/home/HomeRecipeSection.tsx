import broThinkIcon from '../../assets/food_mascot/bro_think.svg'
import eggThinkIcon from '../../assets/food_mascot/egg_think.svg'
import heartIcon from '../../assets/icons/heart.svg'
import kimchiRiceImage from '../meal/images/kimbok.png'
import spamMayoImage from '../meal/images/chamchimayo.png'
import bannerImage from './images/banner.png'
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

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

function HomeRecipeCardItem({ recipe }: { recipe: HomeRecipeCard }) {
  return (
    <article className={`home-recipe-card home-recipe-card--${recipe.size}`}>
      <img className="home-recipe-card__image" src={recipe.image} alt={recipe.title} />
      <div className="home-recipe-card__overlay">
        <div className="home-recipe-card__bottom">
          <div className="home-recipe-card__text">
            <p className="home-recipe-card__channel">
              <span aria-hidden="true">
                <img src={recipe.icon} alt="" />
              </span>
              {recipe.channel}
            </p>
            <h3 className="home-recipe-card__title">{recipe.title}</h3>
          </div>
          <span className="home-recipe-card__likes">
            <img className="home-recipe-card__heart-icon" src={heartIcon} alt="" aria-hidden="true" />
            {recipe.likes}
          </span>
        </div>
      </div>
    </article>
  )
}

function HomeRecipeSection() {
  return (
    <section className="home-recipe-section" aria-labelledby="recipeTitle">
      <div className="home-recipe-section__header">
        <div>
          <h2 id="recipeTitle">
            도락이들의
            <br />
            도시락 모음.zip
          </h2>
          <p>제일 많이 본 인기있는 레시피 모음</p>
        </div>
        <a href="#more-recipes">
          더보기
          <ChevronRightIcon />
        </a>
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

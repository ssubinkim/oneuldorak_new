import recipDorak from './images/dorak_recipe.png'
import './RecipeHeroBanner.css'

function RecipeHeroBanner() {
  return (
    <section className="recipe-hero">
      <p className="recipe-hero__subtitle">
        오늘도 바쁜 도락이들의 도시락 이야기<br />
        도시락도 ROCK이다!
      </p>
      <img src={recipDorak} alt="" className="recipe-hero__mascots" aria-hidden="true" />
    </section>
  )
}

export default RecipeHeroBanner

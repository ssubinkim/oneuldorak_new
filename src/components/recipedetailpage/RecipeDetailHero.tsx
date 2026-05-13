type RecipeDetailHeroProps = {
  image: string
  title: string
}

function RecipeDetailHero({ image, title }: RecipeDetailHeroProps) {
  return <img className="recipe-detail-hero" src={image} alt={title} />
}

export default RecipeDetailHero

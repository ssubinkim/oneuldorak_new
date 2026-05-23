import { HeartIcon } from './GroceryIcons'
import type { StorageRecipe } from './groceryTypes'

type GroceryRecipeCardProps = {
  recipe: StorageRecipe
}

function GroceryRecipeCard({ recipe }: GroceryRecipeCardProps) {
  return (
    <div className="gp-recipe-card">
      <img src={recipe.image} alt={recipe.name} className="gp-recipe-img" />
      <div className="gp-recipe-overlay">
        <span className="gp-recipe-likes">
          <HeartIcon />
          {recipe.likes}
        </span>
        <div className="gp-recipe-info">
          <h3 className="gp-recipe-name">{recipe.name}</h3>
          <p className="gp-recipe-meta">{recipe.price} · {recipe.time} · {recipe.difficulty}</p>
        </div>
      </div>
    </div>
  )
}

export default GroceryRecipeCard

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
        <p className="gp-recipe-channel">🍱 {recipe.channel}</p>
        <div className="gp-recipe-footer">
          <p className="gp-recipe-name">{recipe.name}</p>
          <span className="gp-recipe-likes"><HeartIcon /> {recipe.likes}</span>
        </div>
      </div>
    </div>
  )
}

export default GroceryRecipeCard

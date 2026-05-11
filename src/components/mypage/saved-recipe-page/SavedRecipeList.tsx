import SavedRecipeCard from './SavedRecipeCard'
import type { SavedRecipe } from './SavedRecipeCard'
import './SavedRecipeList.css'

type SavedRecipeListProps = {
  recipes: SavedRecipe[]
}

function SavedRecipeList({ recipes }: SavedRecipeListProps) {
  return (
    <div className="page-scroll">
      <div className="saved-recipe-page">
        <div className="saved-recipe-list">
          {recipes.map((recipe) => (
            <SavedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SavedRecipeList

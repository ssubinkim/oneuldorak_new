import { useState } from 'react'
import GroceryRecipeCard from './GroceryRecipeCard'
import { SearchIcon } from './GroceryIcons'
import { STORAGE_FILTERS, STORAGE_RECIPES } from './groceryData'

function GroceryStorageTab() {
  const [activeFilter, setActiveFilter] = useState('전체')

  return (
    <div>
      <div className="gp-filters">
        {STORAGE_FILTERS.map((filter) => (
          <button
            key={filter}
            className={`gp-filter-chip${activeFilter === filter ? ' gp-filter-chip--active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === '검색' && <SearchIcon />}
            {filter}
          </button>
        ))}
      </div>

      <div className="gp-recipe-grid">
        {STORAGE_RECIPES.map((recipe) => (
          <GroceryRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default GroceryStorageTab

import { getIngredientIconClassName } from '../../mealData'
import { FILTERS, STATUS_INDEX } from './storageData'
import type { Category, FridgeItem } from './storageData'

type StorageIngredientGridProps = {
  items: FridgeItem[]
  activeFilter: Category
  onFilterChange: (filter: Category) => void
}

function StorageIngredientGrid({ items, activeFilter, onFilterChange }: StorageIngredientGridProps) {
  return (
    <>
      <div className="sp-filters">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={`sp-filter-chip${activeFilter === filter ? ' sp-filter-chip--active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="sp-grid">
        {items.map((item) => (
          <StorageIngredientCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}

type StorageIngredientCardProps = {
  item: FridgeItem
}

function StorageIngredientCard({ item }: StorageIngredientCardProps) {
  const indexImg = STATUS_INDEX[item.status]
  const daysLabel = item.days !== null ? `${item.days}일 남음` : '넉넉해요'

  return (
    <div className={`sp-item-card sp-item-card--${item.status}`}>
      <img src={indexImg} alt="" className="sp-item-index" />
      <div className="sp-item-img-wrap">
        {item.isEmoji ? (
          <span className="sp-item-emoji">{item.image}</span>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            className={`sp-item-img ${getIngredientIconClassName(item.image)}`}
          />
        )}
      </div>
      <span className="sp-item-name">{item.name}</span>
      <span className="sp-item-days">{daysLabel}</span>
    </div>
  )
}

export default StorageIngredientGrid

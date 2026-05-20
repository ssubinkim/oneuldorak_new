import './BoardCategoryFilters.css'
import { boardFilters, type BoardFilter } from './boardCategoryFilterData'

type BoardCategoryFiltersProps = {
  activeFilter: BoardFilter
  onChange: (filter: BoardFilter) => void
}

function BoardCategoryFilters({ activeFilter, onChange }: BoardCategoryFiltersProps) {
  return (
    <div className="board-category-filters" aria-label="게시판 필터">
      {boardFilters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={activeFilter === filter ? 'is-active' : undefined}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default BoardCategoryFilters

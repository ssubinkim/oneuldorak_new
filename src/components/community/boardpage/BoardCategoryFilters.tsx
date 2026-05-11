import './BoardCategoryFilters.css'

export type BoardFilter = '인기순' | '최신순' | '냉장고SOS' | '꿀팁' | '추천' | '질문' | '고민'

type BoardCategoryFiltersProps = {
  activeFilter: BoardFilter
  onChange: (filter: BoardFilter) => void
}

const boardFilters: BoardFilter[] = [
  '인기순',
  '최신순',
  '냉장고SOS',
  '꿀팁',
  '추천',
  '질문',
  '고민',
]

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

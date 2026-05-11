import type { VoteFilter } from './VoteList'
import './VoteFilterTabs.css'

type VoteFilterTabsProps = {
  activeFilter: VoteFilter
  onChange: (filter: VoteFilter) => void
}

const voteFilters: { id: VoteFilter; label: string }[] = [
  { id: 'active', label: '진행중' },
  { id: 'ended', label: '종료된 투표' },
]

function VoteFilterTabs({ activeFilter, onChange }: VoteFilterTabsProps) {
  return (
    <div className="vote-filter-tabs" role="tablist" aria-label="투표 상태">
      {voteFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          role="tab"
          aria-selected={activeFilter === filter.id}
          className={activeFilter === filter.id ? 'is-active' : undefined}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default VoteFilterTabs

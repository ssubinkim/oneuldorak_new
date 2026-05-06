import './TopTabBar.css'

type TopTab = 'week' | 'storage'

interface Props {
  topTab: TopTab
  setTopTab: (tab: TopTab) => void
}

const TABS: { key: TopTab; label: string }[] = [
  { key: 'week', label: '이번주 도시락' },
  { key: 'storage', label: '내 재료보관함' },
]

function TopTabBar({ topTab, setTopTab }: Props) {
  return (
    <div className="top-tab-bar">
      {TABS.map(({ key, label }) => (
        <div
          key={key}
          className={`top-tab-item ${topTab === key ? 'active' : ''}`}
          onClick={() => setTopTab(key)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

export default TopTabBar

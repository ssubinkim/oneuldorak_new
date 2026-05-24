import './LikePageTabs.css'

export type LikePageTab = 'recipe' | 'post'

type Props = {
  activeTab: LikePageTab
  onTabChange: (tab: LikePageTab) => void
  visibleTabs?: LikePageTab[]
}

export default function LikePageTabs({ activeTab, onTabChange, visibleTabs }: Props) {
  const tabs: { id: LikePageTab; label: string }[] = [
    { id: 'recipe', label: '레시피' },
    { id: 'post', label: '게시글' },
  ]
  const filtered = visibleTabs ? tabs.filter(t => visibleTabs.includes(t.id)) : tabs

  return (
    <div className="like-tabs">
      {filtered.map(tab => (
        <button
          key={tab.id}
          className={`like-tab${activeTab === tab.id ? ' like-tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

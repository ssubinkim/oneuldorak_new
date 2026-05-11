import './LikePageTabs.css'

export type LikePageTab = 'likes' | 'recipes'

type LikePageTabsProps = {
  activeTab: LikePageTab
  onTabChange: (tab: LikePageTab) => void
}

function LikePageTabs({ activeTab, onTabChange }: LikePageTabsProps) {
  return (
    <div className="like-tabs">
      <button
        className={`like-tab${activeTab === 'likes' ? ' like-tab--active' : ''}`}
        onClick={() => onTabChange('likes')}
      >
        좋아요
      </button>
      <button
        className={`like-tab${activeTab === 'recipes' ? ' like-tab--active' : ''}`}
        onClick={() => onTabChange('recipes')}
      >
        저장한 레시피
      </button>
    </div>
  )
}

export default LikePageTabs

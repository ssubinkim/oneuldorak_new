import './LikePageTabs.css'

export type LikePageTab = 'recipe' | 'post'

type Props = {
  activeTab: LikePageTab
  onTabChange: (tab: LikePageTab) => void
}

export default function LikePageTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="like-tabs">
      <button
        className={`like-tab${activeTab === 'recipe' ? ' like-tab--active' : ''}`}
        onClick={() => onTabChange('recipe')}
      >
        레시피
      </button>
      <button
        className={`like-tab${activeTab === 'post' ? ' like-tab--active' : ''}`}
        onClick={() => onTabChange('post')}
      >
        게시글
      </button>
    </div>
  )
}

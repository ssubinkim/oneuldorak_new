import type { GroceryTab } from './groceryTypes'

type GroceryTabsProps = {
  activeTab: GroceryTab
  checkedShoppingCount: number
  onTabChange: (tab: GroceryTab) => void
}

function GroceryTabs({ activeTab, checkedShoppingCount, onTabChange }: GroceryTabsProps) {
  return (
    <div className="gp-tabs">
      <button
        className={`gp-tab${activeTab === 'recommend' ? ' gp-tab--active' : ''}`}
        onClick={() => onTabChange('recommend')}
      >
        추천재료
      </button>
      <button
        className={`gp-tab${activeTab === 'storage' ? ' gp-tab--active' : ''}`}
        onClick={() => onTabChange('storage')}
      >
        보관함
      </button>
      <button
        className={`gp-tab${activeTab === 'shopping' ? ' gp-tab--active' : ''}`}
        onClick={() => onTabChange('shopping')}
        data-tab="shopping"
      >
        장보기
        <span className="gp-tab-badge">{checkedShoppingCount}</span>
      </button>
    </div>
  )
}

export default GroceryTabs

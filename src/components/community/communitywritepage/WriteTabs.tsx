import { writeTabs } from './writeFormData'
import type { WriteTab } from './writeTab'
import './WriteTabs.css'

type WriteTabsProps = {
  activeTab: WriteTab
  onChange: (tab: WriteTab) => void
}

function WriteTabs({ activeTab, onChange }: WriteTabsProps) {
  return (
    <div className="community-write-tabs" role="tablist" aria-label="글 종류">
      {writeTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default WriteTabs

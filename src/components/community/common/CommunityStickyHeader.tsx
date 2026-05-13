import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import CommunityTabs from './CommunityTabs'
import './CommunityStickyHeader.css'

type CommunityStickyHeaderProps = {
  activeTab: CommunityTabRoute
  tabsClassName: string
  isCompact: boolean
  onSelectTab: (tab: CommunityTabRoute) => void
}

function CommunityStickyHeader({
  activeTab,
  tabsClassName,
  isCompact,
  onSelectTab,
}: CommunityStickyHeaderProps) {
  return (
    <div className={`community-sticky-header${isCompact ? ' is-compact' : ''}`}>
      <CommunityTabs
        activeTab={activeTab}
        className={tabsClassName}
        onSelectTab={onSelectTab}
      />
    </div>
  )
}

export default CommunityStickyHeader

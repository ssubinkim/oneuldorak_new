import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import CommunityBanner from '../communitypage/CommunityBanner'
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
      <CommunityBanner />
      <CommunityTabs
        activeTab={activeTab}
        className={tabsClassName}
        onSelectTab={onSelectTab}
      />
    </div>
  )
}

export default CommunityStickyHeader

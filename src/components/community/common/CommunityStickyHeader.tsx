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
      {isCompact ? (
        <div className="community-sticky-header__banner-top">
          <h1>커뮤니티</h1>
          <div className="community-sticky-header__actions">
            <button type="button" aria-label="검색">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button type="button" aria-label="저장">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
      <CommunityTabs
        activeTab={activeTab}
        className={tabsClassName}
        onSelectTab={onSelectTab}
      />
    </div>
  )
}

export default CommunityStickyHeader

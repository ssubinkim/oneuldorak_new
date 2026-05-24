import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import NavLink from './NavLink'

type CommunityTabsProps = {
  activeTab: CommunityTabRoute
  className: string
  onSelectTab: (tab: CommunityTabRoute) => void
}

const communityTabItems: { id: CommunityTabRoute; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'recipe', label: '도락배틀' },
  { id: 'free', label: '게시판' },
  { id: 'vote', label: '투표' },
]

function CommunityTabs({
  activeTab,
  className,
  onSelectTab,
}: CommunityTabsProps) {
  return (
    <div className={className} role="tablist" aria-label="커뮤니티 카테고리">
      {communityTabItems.map((tab) => (
        <NavLink
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          className={tab.id === 'recipe' ? 'community-tab--recipe' : undefined}
          onClick={() => onSelectTab(tab.id)}
          disabled={tab.id === 'recipe'}
        />
      ))}
    </div>
  )
}

export default CommunityTabs

import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import NavLink from './NavLink'

type CommunityTabsProps = {
  activeTab: CommunityTabRoute
  className: string
  onSelectTab: (tab: CommunityTabRoute) => void
  mutedRecipe?: boolean
}

const communityTabItems: { id: CommunityTabRoute; label: string }[] = [
  { id: 'recipe', label: '레시피 공유' },
  { id: 'free', label: '자유게시판' },
  { id: 'vote', label: '투표' },
]

function CommunityTabs({
  activeTab,
  className,
  onSelectTab,
  mutedRecipe = false,
}: CommunityTabsProps) {
  return (
    <div className={className} role="tablist" aria-label="커뮤니티 카테고리">
      {communityTabItems.map((tab) => (
        <NavLink
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          className={mutedRecipe && tab.id === 'recipe' ? 'community-tab--recipe' : undefined}
          onClick={() => onSelectTab(tab.id)}
        />
      ))}
    </div>
  )
}

export default CommunityTabs

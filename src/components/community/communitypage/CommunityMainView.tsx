import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import CommunityStickyHeader from '../common/CommunityStickyHeader'
import PopularRecipeSection from '../common/PopularRecipeSection'
import useCommunityHeaderCollapse from '../common/useCommunityHeaderCollapse'
import VoteList from '../votepage/VoteList'
import CommunityBanner from './CommunityBanner'
import PopularPosts from './PopularPosts'
import RankingBanner from './RankingBanner'
import { dorakRankings, hotPosts, popularRecipes } from './communityData'
import './CommunityMainView.css'

type CommunityMainViewProps = {
  activeTab: CommunityTabRoute
  onSelectTab: (tab: CommunityTabRoute) => void
}

function CommunityMainView({ activeTab, onSelectTab }: CommunityMainViewProps) {
  const { isHeaderCompact, handleCommunityScroll } = useCommunityHeaderCollapse()

  return (
    <main className="page-scroll community-page" onScroll={handleCommunityScroll}>
      <CommunityBanner />
      <CommunityStickyHeader
        activeTab={activeTab}
        tabsClassName="community-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
      />

      <div className="community-content">
        <VoteList filter="active" variant="featured" />
        <PopularRecipeSection recipes={popularRecipes} />
        <PopularPosts posts={hotPosts} />
        <RankingBanner rankings={dorakRankings} />
      </div>
    </main>
  )
}

export default CommunityMainView

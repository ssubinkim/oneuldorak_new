import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import CommunityTabs from '../common/CommunityTabs'
import PopularRecipeSection from '../common/PopularRecipeSection'
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
  return (
    <main className="page-scroll community-page">
      <CommunityBanner />

      <CommunityTabs
        activeTab={activeTab}
        className="community-tabs"
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

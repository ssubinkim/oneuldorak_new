import { useState } from 'react'
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const {
    isHeaderCompact,
    pageRef,
    compactTriggerRef,
    handleCommunityScroll,
  } = useCommunityHeaderCollapse()

  const handleSearchToggle = () => {
    setIsSearchOpen((previousValue) => !previousValue)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchValue('')
  }

  return (
    <main
      ref={pageRef}
      className="page-scroll community-page"
      onScroll={handleCommunityScroll}
    >
      <CommunityBanner
        isCompact={isHeaderCompact}
        isSearchOpen={isSearchOpen}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchToggle={handleSearchToggle}
        onSearchClose={handleSearchClose}
      />
      <div ref={compactTriggerRef} className="community-banner-compact-trigger" aria-hidden="true" />
      <CommunityStickyHeader
        activeTab={activeTab}
        tabsClassName="community-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
        isSearchOpen={isSearchOpen}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchToggle={handleSearchToggle}
        onSearchClose={handleSearchClose}
      />

      <div className="community-content">
        <VoteList filter="active" variant="featured" onMoreClick={() => onSelectTab('vote')} />
        <PopularRecipeSection recipes={popularRecipes} onMoreClick={() => onSelectTab('recipe')} />
        <PopularPosts posts={hotPosts} onMoreClick={() => onSelectTab('free')} />
        <RankingBanner rankings={dorakRankings} />
      </div>
    </main>
  )
}

export default CommunityMainView

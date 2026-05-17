import { useState } from 'react'
import CommunityStickyHeader from '../../components/community/common/CommunityStickyHeader'
import useCommunityHeaderCollapse from '../../components/community/common/useCommunityHeaderCollapse'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import VoteFilterTabs from '../../components/community/votepage/VoteFilterTabs'
import VoteList, { type VoteCardItem, type VoteFilter } from '../../components/community/votepage/VoteList'
import type { VoteWriteData } from '../../components/community/communitywritepage/writeTypes'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './VotePage.css'

type VotePageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  extraVotes?: VoteCardItem[]
  onUpdateVote?: (voteId: string, data: VoteWriteData) => void
  onDeleteVote?: (voteId: string) => void
  focusVoteId?: string | null
  onFocusHandled?: () => void
}

function VotePage({
  onSelectTab,
  extraVotes = [],
  onUpdateVote,
  onDeleteVote,
  focusVoteId = null,
  onFocusHandled,
}: VotePageProps) {
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('active')
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
      className="page-scroll vote-page"
      onScroll={handleCommunityScroll}
    >
      <CommunityBanner
        variant="vote"
        isCompact={isHeaderCompact}
        isSearchOpen={isSearchOpen}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchToggle={handleSearchToggle}
        onSearchClose={handleSearchClose}
      />
      <div ref={compactTriggerRef} className="community-banner-compact-trigger" aria-hidden="true" />
      <CommunityStickyHeader
        activeTab="vote"
        tabsClassName="community-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
        isSearchOpen={isSearchOpen}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchToggle={handleSearchToggle}
        onSearchClose={handleSearchClose}
      />

      <div className="vote-page__body">
        <VoteList filter="active" variant="featured" extraVotes={extraVotes} />

        <VoteFilterTabs activeFilter={voteFilter} onChange={setVoteFilter} />

        <VoteList
          filter={voteFilter}
          extraVotes={extraVotes}
          onUpdateVote={onUpdateVote}
          onDeleteVote={onDeleteVote}
          focusVoteId={focusVoteId}
          onFocusHandled={onFocusHandled}
        />
      </div>
    </main>
  )
}

export default VotePage

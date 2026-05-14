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
}

function VotePage({
  onSelectTab,
  extraVotes = [],
  onUpdateVote,
  onDeleteVote,
}: VotePageProps) {
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('active')
  const { isHeaderCompact, handleCommunityScroll } = useCommunityHeaderCollapse()

  return (
    <main className="page-scroll vote-page" onScroll={handleCommunityScroll}>
      <CommunityBanner />
      <CommunityStickyHeader
        activeTab="vote"
        tabsClassName="community-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
      />

      <div className="vote-page__body">
        <VoteList filter="active" variant="featured" extraVotes={extraVotes} />

        <VoteFilterTabs activeFilter={voteFilter} onChange={setVoteFilter} />

        <VoteList
          filter={voteFilter}
          extraVotes={extraVotes}
          onUpdateVote={onUpdateVote}
          onDeleteVote={onDeleteVote}
        />
      </div>
    </main>
  )
}

export default VotePage

import { useState } from 'react'
import CommunityStickyHeader from '../../components/community/common/CommunityStickyHeader'
import useCommunityHeaderCollapse from '../../components/community/common/useCommunityHeaderCollapse'
import VoteFilterTabs from '../../components/community/votepage/VoteFilterTabs'
import VoteList, { type VoteCardItem, type VoteFilter } from '../../components/community/votepage/VoteList'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './VotePage.css'

type VotePageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  extraVotes?: VoteCardItem[]
}

function VotePage({ onSelectTab, extraVotes = [] }: VotePageProps) {
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('active')
  const { isHeaderCompact, handleCommunityScroll } = useCommunityHeaderCollapse()

  return (
    <main className="page-scroll vote-page" onScroll={handleCommunityScroll}>
      <CommunityStickyHeader
        activeTab="vote"
        tabsClassName="vote-page-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
      />

      <div className="vote-page__body">
        <VoteList filter="active" variant="featured" extraVotes={extraVotes} />

        <VoteFilterTabs activeFilter={voteFilter} onChange={setVoteFilter} />

        <VoteList filter={voteFilter} extraVotes={extraVotes} />
      </div>
    </main>
  )
}

export default VotePage

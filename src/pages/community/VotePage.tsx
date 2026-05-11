import { useState } from 'react'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import VoteFilterTabs from '../../components/community/votepage/VoteFilterTabs'
import VoteList, { type VoteFilter } from '../../components/community/votepage/VoteList'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './VotePage.css'

type VotePageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
}

function VotePage({ onSelectTab }: VotePageProps) {
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('active')

  return (
    <main className="page-scroll vote-page">
      <CommunityBanner />

      <CommunityTabs
        activeTab="vote"
        className="vote-page-tabs"
        onSelectTab={onSelectTab}
      />

      <div className="vote-page__body">
        <VoteList filter="active" variant="featured" />

        <VoteFilterTabs activeFilter={voteFilter} onChange={setVoteFilter} />

        <VoteList filter={voteFilter} />
      </div>
    </main>
  )
}

export default VotePage

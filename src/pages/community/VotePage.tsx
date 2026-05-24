import { useState } from 'react'
import type React from 'react'
import CommunityStickyHeader from '../../components/community/common/CommunityStickyHeader'
import useCommunityHeaderCollapse from '../../components/community/common/useCommunityHeaderCollapse'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import VoteFilterTabs from '../../components/community/votepage/VoteFilterTabs'
import VoteList, { type VoteCardItem, type VoteFilter } from '../../components/community/votepage/VoteList'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './VotePage.css'

type VotePageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  extraVotes?: VoteCardItem[]
  focusVoteId?: string | null
  onFocusHandled?: () => void
}

function VotePage({
  onSelectTab,
  extraVotes = [],
  focusVoteId = null,
  onFocusHandled,
}: VotePageProps) {
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('active')
  const {
    isHeaderCompact,
    pageRef,
    compactTriggerRef,
    stickyHeaderRef,
    handleCommunityScroll,
  } = useCommunityHeaderCollapse()

  return (
    <main
      ref={pageRef}
      className="page-scroll vote-page"
      onScroll={handleCommunityScroll}
    >
      <div ref={stickyHeaderRef as React.RefObject<HTMLDivElement>} className="community-banner-header">
        <h1>커뮤니티</h1>
      </div>
      <CommunityBanner
        variant="vote"
        hideHeader
        isCompact={isHeaderCompact}
      />
      <div ref={compactTriggerRef} className="community-banner-compact-trigger" aria-hidden="true" />
      <div className="community-card-sheet">
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
            focusVoteId={focusVoteId}
            onFocusHandled={onFocusHandled}
          />
        </div>
      </div>
    </main>
  )
}

export default VotePage

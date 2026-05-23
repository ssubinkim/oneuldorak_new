import { useState } from 'react'
import type React from 'react'
import type { CommunityTabRoute } from '../../../pages/community/CommunityTabRoute'
import CommunityStickyHeader from '../common/CommunityStickyHeader'
import CommunitySearchBar from '../common/CommunitySearchBar'
import useCommunityHeaderCollapse from '../common/useCommunityHeaderCollapse'
import VoteList from '../votepage/VoteList'
import CommunityBanner from './CommunityBanner'
import PopularPosts from './PopularPosts'
import BattleBanner from './BattleBanner'
import Ranking from './Ranking'
import { dorakRankings, hotPosts } from './communityData'
import { mockBoardCommentsByPostId } from '../common/boardMockData'
import { readPersistedBoardComments } from '../common/boardCommentPersistence'
import './CommunityMainView.css'

type CommunityMainViewProps = {
  activeTab: CommunityTabRoute
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenBoardDetail?: (postId: string) => void
}

function CommunityMainView({ activeTab, onSelectTab, onOpenBoardDetail }: CommunityMainViewProps) {
  const persistedComments = readPersistedBoardComments()
  const mockCommentCountById = new Map(
    Object.entries(mockBoardCommentsByPostId).map(([id, comments]) => [id, comments.length])
  )
  const hotPostsWithActualComments = hotPosts.map((post) => ({
    ...post,
    comments: post.id
      ? (persistedComments[post.id]?.length ?? mockCommentCountById.get(post.id) ?? post.comments)
      : post.comments,
  }))

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const {
    isHeaderCompact,
    pageRef,
    compactTriggerRef,
    stickyHeaderRef,
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
      {/* 커뮤니티 헤더 row - sticky, 항상 카드 위에 */}
      <div ref={stickyHeaderRef as React.RefObject<HTMLDivElement>} className="community-banner-header">
        <h1>커뮤니티</h1>
        <div className="community-banner-header__actions">
          <button
            type="button"
            aria-label="검색"
            aria-expanded={isSearchOpen}
            onClick={handleSearchToggle}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
        {isSearchOpen && (
          <div className="community-banner-header__search-overlay">
            <CommunitySearchBar
              value={searchValue}
              onChange={setSearchValue}
              onClose={handleSearchClose}
              onBlur={handleSearchClose}
              showCloseButton={false}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 배너 body만 (subtitle + 마스코트) - 카드가 위로 덮으며 올라옴 */}
      <CommunityBanner
        hideHeader
        isCompact={isHeaderCompact}
      />

      <div ref={compactTriggerRef} className="community-banner-compact-trigger" aria-hidden="true" />

      {/* 흰 카드 - 배너 body 위로 슬라이드, 커뮤니티 헤더 아래에 멈춤 */}
      <div className="community-card-sheet">
        <CommunityStickyHeader
          activeTab={activeTab}
          tabsClassName="community-tabs"
          isCompact={isHeaderCompact}
          onSelectTab={onSelectTab}
        />
        <div className="community-content">
          <Ranking rankings={dorakRankings} />
          <BattleBanner />
          <VoteList filter="active" variant="featured" onMoreClick={() => onSelectTab('vote')} />
          <PopularPosts posts={hotPostsWithActualComments} onPostClick={onOpenBoardDetail} />
        </div>
      </div>
    </main>
  )
}

export default CommunityMainView

import { useState } from 'react'
import BoardCategoryFilters, {
  boardFilters,
  type BoardFilter,
} from '../../components/community/boardpage/BoardCategoryFilters'
import BoardList, { type BoardPost } from '../../components/community/boardpage/BoardList'
import BoardPopularPosts from '../../components/community/boardpage/BoardPopularPosts'
import { mockBoardPopularPosts } from '../../components/community/common/boardMockData'
import CommunityStickyHeader from '../../components/community/common/CommunityStickyHeader'
import useCommunityHeaderCollapse from '../../components/community/common/useCommunityHeaderCollapse'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './BoardPage.css'

type BoardPageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (postId: string) => void
  extraPosts?: BoardPost[]
}

function BoardPage({ onSelectTab, onOpenDetail, extraPosts = [] }: BoardPageProps) {
  const [activeFilter, setActiveFilter] = useState<BoardFilter>(boardFilters[0])
  const { isHeaderCompact, handleCommunityScroll } = useCommunityHeaderCollapse()

  return (
    <main className="page-scroll free-detail-page" onScroll={handleCommunityScroll}>
      <CommunityBanner />
      <CommunityStickyHeader
        activeTab="free"
        tabsClassName="community-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
      />

      <div className="free-detail-body">
        <BoardPopularPosts posts={mockBoardPopularPosts} />
        <BoardCategoryFilters activeFilter={activeFilter} onChange={setActiveFilter} />
        <BoardList activeFilter={activeFilter} onOpenDetail={onOpenDetail} extraPosts={extraPosts} />
      </div>
    </main>
  )
}

export default BoardPage

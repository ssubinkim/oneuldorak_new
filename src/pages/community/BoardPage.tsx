import { useState } from 'react'
import BoardCategoryFilters, {
  boardFilters,
  type BoardFilter,
} from '../../components/community/boardpage/BoardCategoryFilters'
import BoardList, { type BoardPost } from '../../components/community/boardpage/BoardList'
import BoardPopularPosts, { type BoardPopularPost } from '../../components/community/boardpage/BoardPopularPosts'
import CommunityStickyHeader from '../../components/community/common/CommunityStickyHeader'
import useCommunityHeaderCollapse from '../../components/community/common/useCommunityHeaderCollapse'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './BoardPage.css'

type BoardPageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (postId: string) => void
  extraPosts?: BoardPost[]
}

const popularPosts: BoardPopularPost[] = [
  { rank: 1, title: '오늘 점심 권태기 어떻게 해결하시나요?', likes: 100, comments: 88 },
  { rank: 2, title: '일주일 식단 짜다가 진짜 도시락 찾음', likes: 96, comments: 65 },
  { rank: 3, title: '식비 월 20만원으로 줄인 후기', likes: 65, comments: 52 },
]

function BoardPage({ onSelectTab, onOpenDetail, extraPosts = [] }: BoardPageProps) {
  const [activeFilter, setActiveFilter] = useState<BoardFilter>(boardFilters[0])
  const { isHeaderCompact, handleCommunityScroll } = useCommunityHeaderCollapse()

  return (
    <main className="page-scroll free-detail-page" onScroll={handleCommunityScroll}>
      <CommunityStickyHeader
        activeTab="free"
        tabsClassName="free-detail-tabs"
        isCompact={isHeaderCompact}
        onSelectTab={onSelectTab}
      />

      <div className="free-detail-body">
        <BoardPopularPosts posts={popularPosts} />
        <BoardCategoryFilters activeFilter={activeFilter} onChange={setActiveFilter} />
        <BoardList activeFilter={activeFilter} onOpenDetail={onOpenDetail} extraPosts={extraPosts} />
      </div>
    </main>
  )
}

export default BoardPage

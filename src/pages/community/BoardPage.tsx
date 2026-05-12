import { useState } from 'react'
import BoardCategoryFilters, {
  boardFilters,
  type BoardFilter,
} from '../../components/community/boardpage/BoardCategoryFilters'
import BoardList from '../../components/community/boardpage/BoardList'
import BoardPopularPosts, { type BoardPopularPost } from '../../components/community/boardpage/BoardPopularPosts'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './BoardPage.css'

type BoardPageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (postId: string) => void
}

const popularPosts: BoardPopularPost[] = [
  { rank: 1, title: '오늘 점심 권태기 어떻게 해결하시나요?', likes: 100, comments: 88 },
  { rank: 2, title: '일주일 식단 짜다가 진짜 도시락 찾음', likes: 96, comments: 65 },
  { rank: 3, title: '식비 월 20만원으로 줄인 후기', likes: 65, comments: 52 },
]

function BoardPage({ onSelectTab, onOpenDetail }: BoardPageProps) {
  const [activeFilter, setActiveFilter] = useState<BoardFilter>(boardFilters[0])

  return (
    <main className="page-scroll free-detail-page">
      <CommunityBanner />

      <CommunityTabs
        activeTab="free"
        className="free-detail-tabs"
        onSelectTab={onSelectTab}
      />

      <div className="free-detail-body">
        <BoardPopularPosts posts={popularPosts} />
        <BoardCategoryFilters activeFilter={activeFilter} onChange={setActiveFilter} />
        <BoardList activeFilter={activeFilter} onOpenDetail={onOpenDetail} />
      </div>
    </main>
  )
}

export default BoardPage

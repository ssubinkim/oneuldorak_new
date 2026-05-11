import { useState } from 'react'
import BoardCategoryFilters, { type BoardFilter } from '../../components/community/boardpage/BoardCategoryFilters'
import BoardList from '../../components/community/boardpage/BoardList'
import BoardPopularPosts, { type BoardPopularPost } from '../../components/community/boardpage/BoardPopularPosts'
import CommunityWriteButton from '../../components/community/common/CommunityWriteButton'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import CommunityBanner from '../../components/community/communitypage/CommunityBanner'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './BoardPage.css'

type BoardPageProps = {
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (postId: string) => void
}

const popularPosts: BoardPopularPost[] = [
  { rank: 1, title: '다들 도시락 권태기 어떻게 이겨내시나요?', likes: 100, comments: 88 },
  { rank: 2, title: '일주일 먹어도 안 질리는 레시피 찾음;;', likes: 96, comments: 65 },
  { rank: 3, title: '식비 월 20만원으로 줄인 후기', likes: 65, comments: 52 },
]

function BoardPage({ onSelectTab, onOpenDetail }: BoardPageProps) {
  const [activeFilter, setActiveFilter] = useState<BoardFilter>('인기순')

  return (
    <>
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

      <CommunityWriteButton className="free-detail-fab" aria-label="글쓰기" />
    </>
  )
}

export default BoardPage

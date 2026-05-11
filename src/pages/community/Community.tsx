import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import BoardDetailPage from './BoardDetailPage'
import BoardPage from './BoardPage'
import type { CommunityTabRoute } from './CommunityTabRoute'
import CommunityMainView from '../../components/community/communitypage/CommunityMainView'
import Header from '../../components/common/layout/Header'
import RecipeDetailPage from '../recipedetail/RecipeDetailPage'
import RecipePage from './RecipePage'
import VotePage from './VotePage'
import '../../styles/Tailwind.css'

type CommunityTab = CommunityTabRoute
type CommunityView = 'main' | 'recipe' | 'free' | 'vote' | 'detail' | 'boardDetail'

const tabViewMap: Record<CommunityTab, CommunityView> = {
  all: 'main',
  recipe: 'recipe',
  free: 'free',
  vote: 'vote',
}

function Community() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('all')
  const [view, setView] = useState<CommunityView>('main')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)

  const handleTabClick = (tab: CommunityTab) => {
    setActiveTab(tab)
    setView(tabViewMap[tab])
  }

  const handleOpenRecipeDetail = (recipeId: string) => {
    setSelectedRecipeId(recipeId)
    setView('detail')
  }

  const handleOpenBoardDetail = (postId: string) => {
    setSelectedBoardId(postId)
    setView('boardDetail')
  }

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        {view === 'main' && (
          /* CommunityMainView: 커뮤니티 메인 배너, 탭, 투표/레시피/인기글/랭킹 영역 */
          <CommunityMainView activeTab={activeTab} onSelectTab={handleTabClick} />
        )}

        {view === 'recipe' && (
          /* RecipePage: 레시피 탭 목록 화면 */
          <RecipePage
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenRecipeDetail}
          />
        )}

        {view === 'free' && (
          /* BoardPage: 자유 게시글 탭 목록 화면 */
          <BoardPage
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenBoardDetail}
          />
        )}

        {view === 'detail' && (
          /* RecipeDetailPage: 선택한 레시피 상세 화면 */
          <RecipeDetailPage
            recipeId={selectedRecipeId}
            onBack={() => setView('recipe')}
          />
        )}

        {view === 'boardDetail' && (
          /* BoardDetailPage: 선택한 자유 게시글 상세 화면 */
          <BoardDetailPage
            postId={selectedBoardId}
            onBack={() => setView('free')}
            onOpenPost={handleOpenBoardDetail}
          />
        )}

        {view === 'vote' && (
          /* VotePage: 투표 탭 목록 화면 */
          <VotePage
            onSelectTab={handleTabClick}
          />
        )}

        {/* BottomNav: 하단 탭바 영역 */}
        <BottomNav />
      </div>
    </div>
  )
}

export default Community

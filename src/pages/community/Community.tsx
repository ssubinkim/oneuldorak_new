import { useState } from 'react'
import BottomNav from '../../components/common/BottomNav'
import BoardDetailPage from './BoardDetailPage'
import BoardPage from './BoardPage'
import type { CommunityTabRoute } from './CommunityTabRoute'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import Header from '../../components/common/Header'
import PopularPosts from '../../components/community/communitypage/PopularPosts'
import RankingBanner from '../../components/community/communitypage/RankingBanner'
import RecipeDetailPage from '../recipedetail/RecipeDetailPage'
import RecipePage from './RecipePage'
import SavedPostBox from '../../components/community/communitypage/SavedPostBox'
import SearchBar from '../../components/common/SearchBar'
import ShortsSection from '../../components/community/communitypage/ShortsSection'
import VotePreviewBox from '../../components/community/communitypage/VotePreviewBox'
import VotePage from './VotePage'
import '../../styles/Tailwind.css'
import './Community.css'

type CommunityTab = CommunityTabRoute

const hotPosts = [
  { title: '3000원으로 만드는 도시락', likes: 100, comments: 35 },
  { title: '냉동실 파먹기 레시피', likes: 80, comments: 25 },
  { title: '5분 완성 간단 볶음밥', likes: 60, comments: 15 },
]

const shortsItems = [
  {
    id: 'shorts-1',
    title: '초간단 주먹밥',
    hash: '#직장인 #10분 컷',
    author: '도시락킹',
    views: '조회수 57만회',
    timeAgo: '2년전',
  },
  {
    id: 'shorts-2',
    title: '냉털 도시락 싸기',
    hash: '#냉장고 #알뜰식단',
    author: '알뜰이',
    views: '조회수 23만회',
    timeAgo: '1년전',
  },
  {
    id: 'shorts-3',
    title: '5분 볶음밥 루틴',
    hash: '#간단요리 #점심',
    author: '요리초보',
    views: '조회수 18만회',
    timeAgo: '8개월전',
  },
]

function Community() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('recipe')
  const [view, setView] = useState<'main' | 'recipe' | 'free' | 'vote' | 'detail' | 'boardDetail'>('main')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)

  const handleTabClick = (tab: CommunityTab) => {
    if (tab === 'recipe') {
      setView('recipe')
      setActiveTab(tab)
      return
    }

    if (tab === 'free') {
      setView('free')
      setActiveTab(tab)
      return
    }

    if (tab === 'vote') {
      setView('vote')
      setActiveTab(tab)
      return
    }

    setActiveTab(tab)
    setView('main')
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
          <main className="page-scroll community-page">
            <section className="community-top">
              <h1>커뮤니티</h1>
              <SearchBar id="community-search-input" placeholder="검색" />
            </section>

            <CommunityTabs
              activeTab={activeTab}
              className="community-tabs"
              mutedRecipe
              onSelectTab={handleTabClick}
            />

            <div className="community-content">
              <PopularPosts posts={hotPosts} />

              <ShortsSection shorts={shortsItems} />

              <SavedPostBox />

              <VotePreviewBox />

              <RankingBanner />
            </div>
          </main>
        )}

        {view === 'recipe' && (
          <RecipePage
            onBack={() => setView('main')}
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenRecipeDetail}
          />
        )}

        {view === 'free' && (
          <BoardPage
            onBack={() => setView('main')}
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenBoardDetail}
          />
        )}

        {view === 'detail' && (
          <RecipeDetailPage
            recipeId={selectedRecipeId}
            onBack={() => setView('recipe')}
          />
        )}

        {view === 'boardDetail' && (
          <BoardDetailPage
            postId={selectedBoardId}
            onBack={() => setView('free')}
          />
        )}

        {view === 'vote' && (
          <VotePage
            onBack={() => setView('main')}
            onSelectTab={handleTabClick}
          />
        )}

        <BottomNav />
      </div>
    </div>
  )
}

export default Community

import { useState } from 'react'
import BottomNav from '../../components/common/BottomNav'
import BoardDetailPage from './BoardDetailPage'
import BoardPage from './BoardPage'
import Header from '../../components/common/Header'
import RecipeDetailPage from './RecipeDetailPage'
import RecipePage, { type CommunityTabRoute } from './RecipePage'
import VotePage from './VotePage'
import '../../styles/Tailwind.css'
import './Community.css'

type CommunityTab = CommunityTabRoute

const communityTabs: { id: CommunityTab; label: string }[] = [
  { id: 'recipe', label: '레시피 공유' },
  { id: 'free', label: '자유게시판' },
  { id: 'vote', label: '투표' },
]

const hotPosts = [
  { title: '3000원으로 만드는 도시락', likes: 100, comments: 35 },
  { title: '냉동실 파먹기 레시피', likes: 80, comments: 25 },
  { title: '5분 완성 간단 볶음밥', likes: 60, comments: 15 },
]

const recipeCards = new Array(3).fill(null).map((_, index) => ({
  id: `recipe-card-${index + 1}`,
  title: '초간단 주먹밥',
  hash: '#직장인 #10분 컷',
  category: '도시락킹',
  views: '조회수 57만회',
  comments: '2년전',
}))

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
              <label className="community-search" htmlFor="community-search-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M16.2 16.2 20 20" />
                </svg>
                <input id="community-search-input" type="text" placeholder="검색" />
              </label>
            </section>

            <div className="community-tabs" role="tablist" aria-label="커뮤니티 카테고리">
              {communityTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  className={tab.id === 'recipe' ? 'community-tab--recipe' : undefined}
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="community-content">
              <section className="community-card community-hot-card">
                <div className="community-card__header">
                  <h2>오늘의 인기글</h2>
                  <button type="button" aria-label="오늘의 인기글 더보기">
                    ↗
                  </button>
                </div>
                <div className="community-hot-list">
                  {hotPosts.map((post) => (
                    <article className="community-hot-item" key={post.title}>
                      <div className="community-hot-item__thumb" aria-hidden="true" />
                      <div>
                        <h3>{post.title}</h3>
                        <p>좋아요 {post.likes} · 댓글 {post.comments}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="community-recipe-row" aria-label="인기 레시피 카드">
                {recipeCards.map((item) => (
                  <article className="community-recipe-card" key={item.id}>
                    <div className="community-recipe-card__image" aria-hidden="true" />
                    <div className="community-recipe-card__body">
                      <h3>{item.title}</h3>
                      <p>{item.hash}</p>
                      <div className="community-recipe-card__meta">
                        <span className="community-recipe-card__avatar" aria-hidden="true" />
                        <span>{item.category}</span>
                      </div>
                      <small>
                        {item.views} · {item.comments}
                      </small>
                    </div>
                  </article>
                ))}
              </section>

              <section className="community-card community-saved-card">
                <button type="button" className="community-card-link" aria-label="저장한 글 보기">
                  <div>
                    <h2>저장한 글</h2>
                    <p>오늘도락 페이지에서 다시 볼 수 있어요</p>
                  </div>
                  <span>12 ›</span>
                </button>
              </section>

              <section className="community-card community-vote-card">
                <div className="community-card__header">
                  <h2>최근 인기 투표</h2>
                  <button type="button" aria-label="최근 인기 투표 더보기">
                    더보기›
                  </button>
                </div>
                <article className="community-vote-item">
                  <div>
                    <h3>내일 뭐 싸지?</h3>
                    <p>참여 742명 · 23시간 남음</p>
                  </div>
                  <span>1P</span>
                </article>
              </section>

              <section className="community-rank-banner">
                <button type="button" className="community-card-link" aria-label="랭킹 확인하기">
                  <div>
                    <h2>☆ 랭킹</h2>
                    <p>이번 주 나의 순위를 확인하세요</p>
                  </div>
                  <span>›</span>
                </button>
              </section>
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

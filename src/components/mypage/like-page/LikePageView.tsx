import { useState } from 'react'
import BottomNav from '../../common/layout/BottomNav'
import LikePostCard from './LikePostCard'
import type { LikePost } from './LikePostCard'
import SavedRecipeCard from '../saved-recipe-page/SavedRecipeCard'
import type { SavedRecipe } from '../saved-recipe-page/SavedRecipeCard'
import '../../../styles/Tailwind.css'
import './LikePage.css'

const LIKED_POSTS: LikePost[] = [
  { id: 1, category: '꿀팁', showIcon: true, title: '식비 월 20만원으로 줄인 후기', savedAt: '2일 전 저장' },
  { id: 2, category: '냉장고 SOS', showIcon: false, title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?', savedAt: '3일 전 저장' },
  { id: 3, category: '자취', showIcon: true, title: '매일 도시락 싸는 게 힘들어요', savedAt: '3일 전 저장' },
  { id: 4, category: '추천', showIcon: false, title: '도시락 용기 추천 부탁드려요', savedAt: '4일 전 저장' },
]

const SAVED_RECIPES: SavedRecipe[] = [
  { id: 1, showIcon: false, title: '냉동실 파먹기 레시피', savedAt: '5일 전 저장' },
  { id: 2, showIcon: true, title: '3000원으로 만드는 도시락', savedAt: '2일 전 저장' },
  { id: 3, showIcon: false, title: '냉동실 파먹기 레시피', savedAt: '5일 전 저장' },
  { id: 4, showIcon: false, title: '냉동실 파먹기 레시피', savedAt: '5일 전 저장' },
]

type Tab = 'likes' | 'recipes'
type Props = { onBack?: () => void; initialTab?: Tab }

function LikePageView({ onBack, initialTab = 'likes' }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  return (
    <div className="app-shell">
      <div className="app-screen">

        {/* 헤더 */}
        <header className="like-header">
          <button
            className="like-header-back"
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* 탭 */}
        <div className="like-tabs">
          <button
            className={`like-tab${activeTab === 'likes' ? ' like-tab--active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            좋아요
          </button>
          <button
            className={`like-tab${activeTab === 'recipes' ? ' like-tab--active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            저장한 레시피
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="page-scroll">
          <div className="like-page">
            {activeTab === 'likes' ? (
              <div className="like-list">
                {LIKED_POSTS.map((post) => (
                  <LikePostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="like-list">
                {SAVED_RECIPES.map((recipe) => (
                  <SavedRecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default LikePageView

import { useState } from 'react'
import LikePostCard from './LikePostCard'
import type { LikePost } from './LikePostCard'
import LikeRecipeCard from './LikeRecipeCard'
import type { LikePageTab } from './LikePageTabs'
import type { LikeRecipe } from './likePageData'
import './LikePageContent.css'

const RECIPE_FILTERS = ['전체', '가격순', '시간순', '난이도순']
const POST_FILTERS = ['전체', '냉장고SOS', '꿀팁', '추천', '질문', '고민']

type Props = {
  activeTab: LikePageTab
  likedPosts: LikePost[]
  likedRecipes: LikeRecipe[]
}

export default function LikePageContent({ activeTab, likedPosts, likedRecipes }: Props) {
  const [activeFilter, setActiveFilter] = useState('전체')

  const isRecipe = activeTab === 'recipe'
  const filters = isRecipe ? RECIPE_FILTERS : POST_FILTERS
  const count = isRecipe ? likedRecipes.length : likedPosts.length
  const unit = isRecipe ? '레시피' : '게시글'

  const handleTabChange = () => setActiveFilter('전체')
  void handleTabChange

  return (
    <div className="like-content">
      <div className="like-content-bar">
        <span className="like-content-count">총 {count}개의 {unit}</span>
        <button className="like-content-sort">최신순 ∨</button>
      </div>

      <div className="like-content-filters">
        {filters.map((f) => (
          <button
            key={f}
            className={`like-filter-chip${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="like-list">
        {count === 0 ? (
          <div className="lp-card">
            <div className="lp-card-title">아직 좋아요한 항목이 없어요</div>
            <div className="lp-card-date">관심있는 레시피나 게시글에 좋아요를 눌러보세요.</div>
          </div>
        ) : (
          isRecipe
            ? likedRecipes.map((r) => <LikeRecipeCard key={r.id} recipe={r} />)
            : likedPosts.map((p) => <LikePostCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  )
}
